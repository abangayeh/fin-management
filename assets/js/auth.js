"use strict";

(function () {
  const client = window.supabaseClient;

  if (!client) {
    console.error("Supabase client belum tersedia.");
    return;
  }

  // ==============================
  // PENDAFTARAN AKUN
  // ==============================

  async function register({ name, email, password }) {
    if (!name || !email || !password) {
      throw new Error("Nama, email, dan password wajib diisi.");
    }

    if (password.length < 8) {
      throw new Error("Password minimal 8 karakter.");
    }

    const { data, error } = await client.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          full_name: name.trim()
        }
      }
    });

    if (error) throw error;

    return {
      user: data.user,
      session: data.session,
      needsEmailConfirmation: !data.session
    };
  }

  // ==============================
  // LOGIN
  // ==============================

  async function login({ email, password }) {
    if (!email || !password) {
      throw new Error("Email dan password wajib diisi.");
    }

    const { data, error } =
      await client.auth.signInWithPassword({
        email: email.trim(),
        password
      });

    if (error) throw error;

    return data;
  }

  // ==============================
  // LOGOUT
  // ==============================

  async function logout() {
    const { error } = await client.auth.signOut();

    if (error) throw error;

    return true;
  }

  // ==============================
  // CEK SESSION
  // ==============================

  async function getCurrentUser() {
    const { data, error } = await client.auth.getUser();

    if (error) throw error;

    return data.user;
  }

  // ==============================
  // CEK SESSION AKTIF
  // ==============================

  async function getSession() {
    const { data, error } =
      await client.auth.getSession();

    if (error) throw error;

    return data.session;
  }

  // ==============================
  // PANTAU PERUBAHAN LOGIN
  // ==============================

  function onAuthChange(callback) {
    return client.auth.onAuthStateChange(
      (event, session) => {
        callback({
          event,
          session,
          user: session?.user || null
        });

        window.dispatchEvent(
          new CustomEvent("fin:auth-state", {
            detail: {
              event,
              session,
              user: session?.user || null
            }
          })
        );
      }
    );
  }

  // ==============================
  // LUPA PASSWORD
  // ==============================

  async function resetPassword(email) {
    if (!email) {
      throw new Error("Masukkan email terlebih dahulu.");
    }

    const { error } = await client.auth.resetPasswordForEmail(
      email.trim(),
      {
        redirectTo: window.location.origin
      }
    );

    if (error) throw error;

    return true;
  }

  // ==============================
  // AKSES FUNGSI GLOBAL
  // ==============================

  window.FinAuth = {
    register,
    login,
    logout,
    getCurrentUser,
    getSession,
    onAuthChange,
    resetPassword
  };

})();
