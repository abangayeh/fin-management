"use strict";

window.supabaseClient = window.supabase.createClient(
  "https://jttyhnhyqkehzwaxywzk.supabase.co",
  "sb_publishable_uUQy8lzzAHWH4X2t71b_tA_e3vIVrUk",
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    }
  }
);
