const antibookingSupabase = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storage: window.localStorage
    }
  }
);

window.antibookingSupabase = antibookingSupabase;
window.supabaseClient = antibookingSupabase;

function byId(id) {
  return document.getElementById(id);
}

function safeText(value) {
  return String(value || "").replace(/[<>&"]/g, function(char) {
    return { "<": "&lt;", ">": "&gt;", "&": "&amp;", "\"": "&quot;" }[char];
  });
}
