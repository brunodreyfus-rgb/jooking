(function () {
  function showClientError(message) {
    console.error("[Jooking Supabase]", message);
    var boxes = ["adminLoginStatus", "adminAuthBox"];
    boxes.forEach(function (id) {
      var el = document.getElementById(id);
      if (el) {
        el.textContent = message;
        el.style.color = "#991b1b";
        el.style.fontWeight = "900";
      }
    });
  }

  if (!window.supabase || typeof window.supabase.createClient !== "function") {
    showClientError("Supabase library did not load. Check CDN/network/ad blocker.");
    return;
  }

  if (!window.SUPABASE_URL || !window.SUPABASE_PUBLISHABLE_KEY) {
    showClientError("Supabase config missing. Check assets/js/supabase-config.js.");
    return;
  }

  try {
    window.antibookingSupabase = window.supabase.createClient(
      window.SUPABASE_URL,
      window.SUPABASE_PUBLISHABLE_KEY,
      {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
          storageKey: "jooking-admin-auth"
        }
      }
    );
    window.supabaseClient = window.antibookingSupabase;
  } catch (error) {
    showClientError("Could not initialize Supabase: " + (error && error.message ? error.message : error));
  }
})();

function byId(id) {
  return document.getElementById(id);
}

function safeText(value) {
  return String(value || "").replace(/[<>&"]/g, function(char) {
    return { "<": "&lt;", ">": "&gt;", "&": "&amp;", "\"": "&quot;" }[char];
  });
}
