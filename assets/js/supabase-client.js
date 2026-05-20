const antibookingSupabase = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);

function byId(id) {
  return document.getElementById(id);
}

function safeText(value) {
  return String(value || "").replace(/[<>&"]/g, function(char) {
    return { "<": "&lt;", ">": "&gt;", "&": "&amp;", "\"": "&quot;" }[char];
  });
}
