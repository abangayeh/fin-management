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

    // Cari dompet berdasarkan keanggotaan
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

    // Ambil informasi dompet
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
  // BUAT KODE UNDANGAN
  // ==================================

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

  // ==================================
  // GABUNG DOMPET DENGAN KODE UNDANGAN
  // ==================================

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

    // Muat ulang informasi dompet setelah bergabung
    currentWallet = null;
    await initialize();

    return data;
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
    createWalletInvite,
    joinWalletByInvite,
    getCurrentWallet,
    getCurrentUser
  };

})();
