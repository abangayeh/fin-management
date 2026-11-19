"use strict";

(function () {
const client = window.supabaseClient;

if (!client) {
console.error("Supabase client belum tersedia.");
return;
}

let currentUser = null;
let currentWallet = null;

// ==================================
// INISIALISASI PENGGUNA DAN DOMPET
// ==================================

async function initialize() {
const { data: userData, error: userError } =
await client.auth.getUser();

if (userError) throw userError;

if (!userData.user) {
  throw new Error("Pengguna belum login.");
}

currentUser = userData.user;

const { data: wallets, error: walletError } =
  await client
    .from("wallets")
    .select("id, name, created_by")
    .eq("created_by", currentUser.id)
    .limit(1);

if (walletError) throw walletError;

if (!wallets || wallets.length === 0) {
  throw new Error("Dompet pribadi belum ditemukan.");
}

currentWallet = wallets[0];

return {
  user: currentUser,
  wallet: currentWallet
};

}

// ==================================
// AMBIL SELURUH TRANSAKSI
// ==================================

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

return data.map(item => ({
  id: item.id,
  description: item.description,
  amount: Number(item.amount),
  type: item.type,
  category: item.category,
  date: item.transaction_date,
  note: item.note || "",
  createdAt: item.created_at
}));

}

// ==================================
// SIMPAN TRANSAKSI
// ==================================

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

// ==================================
// HAPUS TRANSAKSI
// ==================================

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

// ==================================
// INFORMASI PENGGUNA DAN DOMPET
// ==================================

function getCurrentWallet() {
return currentWallet;
}

function getCurrentUser() {
return currentUser;
}

// ==================================
// FUNGSI GLOBAL
// ==================================

window.FinDB = {
initialize,
getTransactions,
addTransaction,
deleteTransaction,
getCurrentWallet,
getCurrentUser
};

})();
