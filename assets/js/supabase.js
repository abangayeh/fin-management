"use strict";

const SUPABASE_URL =
  "https://jttyhnhyqkehzwaxywzk.supabase.co";

const SUPABASE_KEY =
  "sb_publishable_uUQy8lzzAHWH4X2t71b_tA_e3vIVrUk";

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    }
  }
);
