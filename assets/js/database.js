"use strict";

(function () {
const client = window.supabaseClient;

if (!client) {
console.error("Supabase client belum tersedia.");
return;
}

let currentUser = null;
let currentWallet = null;

async function initialize() {
const { data: userData, error: userError } =
await client.auth.getUser();

if (userError) throw userError;
if (!userData.user) {
  throw new Error("Pengguna belum login.");
}

currentUser = userData.user;

const { data: membership, error: memberError } =
  await client
    .from("wallet_members")
    .select("wallet_id")
    .eq("user_id", currentUser.id)
    .limit(1)
    .maybeSingle();

if (memberError) throw memberError;
if (!membership) {
  throw new Error("Anda belum memiliki dompet.");
}

const { data: wallet, error: walletError } =
  await client
    .from("wallets")
    .select("id, name, created_by")
    .eq("id", membership.wallet_id)
    .single();

if (walletError) throw walletError;

currentWallet = wallet;

return {
  user: currentUser,
  wallet: currentWallet
};

}

async function getTransactionComments(transactionId) {
  if (!currentUser || !currentWallet) {
    await initialize();
  }

  const wallet = getCurrentWallet();

  if (!wallet) {
    throw new Error("Dompet tidak ditemukan.");
  }

  const { data: comments, error } = await client
    .from("transaction_comments")
    .select("id,wallet_id,transaction_id,user_id,comment,created_at")
    .eq("wallet_id", wallet.id)
    .eq("transaction_id", transactionId)
    .order("created_at", { ascending: true });

  if (error) throw error;
  if (!comments || comments.length === 0) return [];

  const userIds = [
    ...new Set(comments.map(comment => comment.user_id).filter(Boolean))
  ];

  let profiles = [];

  if (userIds.length > 0) {
    const { data, error: profileError } = await client
      .from("profiles")
      .select("id,full_name")
      .in("id", userIds);

    if (profileError) {
      console.warn("Nama pengguna gagal dimuat:", profileError);
    } else {
      profiles = data || [];
    }
  }

  const names = new Map(
    profiles.map(profile => [profile.id, profile.full_name])
  );

  return comments.map(comment => ({
    ...comment,
    full_name: names.get(comment.user_id) || "Pengguna"
  }));
}
async function getTransactions() {
  if (!currentUser || !currentWallet) {
    await initialize();
  }

  const { data, error } = await client
    .from("transactions")
    .select("*")
    .eq("wallet_id", currentWallet.id)
    .order("transaction_date", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data || []).map(transaction => ({
  ...transaction,
  date: transaction.transaction_date
}));
}
async function addTransaction(transaction) {
if (!currentUser || !currentWallet) {
await initialize();
}

const payload = {
  wallet_id: currentWallet.id,
  user_id: currentUser.id,
  description: transaction.description,
  amount: transaction.amount,
  type: transaction.type,
  category: transaction.category,
  transaction_date: transaction.date,
  note: transaction.note || ""
};

const { data, error } = await client
  .from("transactions")
  .insert(payload)
  .select()
  .single();

if (error) throw error;

return data;

}

async function deleteTransaction(id) {
if (!currentUser || !currentWallet) {
await initialize();
}

const { error } = await client
  .from("transactions")
  .delete()
  .eq("id", id)
  .eq("wallet_id", currentWallet.id)
  .eq("user_id", currentUser.id);

if (error) throw error;

return true;

}

// AMBIL RIWAYAT PERUBAHAN TRANSAKSI
async function getTransactionLogs() {
  if (!currentUser || !currentWallet) {
    await initialize();
  }

  const { data: logs, error } = await client
    .from("transaction_logs")
    .select("*")
    .eq("wallet_id", currentWallet.id)
    .order("created_at", { ascending: false });

  if (error) throw error;
  if (!logs || logs.length === 0) return [];

  const userIds = [
    ...new Set(logs.map(log => log.user_id).filter(Boolean))
  ];

  let profiles = [];

  if (userIds.length > 0) {
    const { data, error: profileError } = await client
      .from("profiles")
      .select("id,full_name")
      .in("id", userIds);

    if (profileError) {
      console.warn("Nama pengguna gagal dimuat:", profileError);
    } else {
      profiles = data || [];
    }
  }

  const names = new Map(
    profiles.map(profile => [profile.id, profile.full_name])
  );

  return logs.map(log => ({
    ...log,
    full_name: names.get(log.user_id) || "Pengguna"
  }));
}

// AMBIL KOMENTAR TRANSAKSI

// TAMBAHKAN KOMENTAR TRANSAKSI
async function addTransactionComment(transactionId, comment) {
  if (!currentUser || !currentWallet) {
    await initialize();
  }

  const wallet = getCurrentWallet();

  if (!wallet) {
    throw new Error("Dompet tidak ditemukan.");
  }

  const cleanComment = String(comment || "").trim();

  if (!cleanComment) {
    throw new Error("Komentar tidak boleh kosong.");
  }

  const { data, error } = await client
    .from("transaction_comments")
    .insert({
      wallet_id: wallet.id,
      transaction_id: transactionId,
      user_id: currentUser.id,
      comment: cleanComment
    })
    .select()
    .single();

  if (error) throw error;

  return data;
}
async function createWalletInvite() {
if (!currentUser || !currentWallet) {
await initialize();
}

const { data, error } = await client.rpc(
  "create_wallet_invite",
  {
    p_wallet_id: currentWallet.id
  }
);

if (error) throw error;

return data;

}

async function joinWalletByInvite(code) {
if (!code) {
throw new Error("Masukkan kode undangan.");
}

const { data, error } = await client.rpc(
  "join_wallet_by_invite",
  {
    p_code: code.trim()
  }
);

if (error) throw error;

currentWallet = null;
await initialize();

return data;

}

function getCurrentWallet() {
return currentWallet;
}

function getCurrentUser() {
return currentUser;
}

window.FinDB = {
initialize,
getTransactions,
addTransaction,
deleteTransaction,
getTransactionLogs,
getTransactionComments,
addTransactionComment,
createWalletInvite,
joinWalletByInvite,
getCurrentWallet,
getCurrentUser
};

})();
