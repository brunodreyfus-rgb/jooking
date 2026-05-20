function getLoginClient() {
  if (window.antibookingSupabase) return window.antibookingSupabase;
  if (window.supabaseClient) return window.supabaseClient;
  try { if (typeof antibookingSupabase !== "undefined") return antibookingSupabase; } catch(e) {}
  return null;
}

function setLoginStatus(message, ok = true) {
  const el = document.getElementById("adminLoginStatus");
  if (!el) return;
  el.textContent = message;
  el.style.color = ok ? "#166534" : "#991b1b";
  el.style.fontWeight = "900";
}

document.addEventListener("DOMContentLoaded", async () => {
  const client = getLoginClient();
  const form = document.getElementById("adminLoginForm");

  if (!client) {
    setLoginStatus("Supabase client missing. Open /pages/supabase-test.html to diagnose.", false);
    return;
  }

  try {
    const { data, error } = await client.auth.getSession();
    if (error) setLoginStatus("Session check error: " + error.message, false);
    if (data?.session) setLoginStatus(`Already logged in as ${data.session.user.email}.`);
  } catch (error) {
    setLoginStatus("Session check failed: " + (error.message || error), false);
  }

  form?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const email = document.getElementById("adminEmail").value.trim();
    const password = document.getElementById("adminPassword").value;

    setLoginStatus("Logging in...");

    try {
      const { data, error } = await client.auth.signInWithPassword({ email, password });
      if (error) {
        setLoginStatus(error.message, false);
        return;
      }
      setLoginStatus(`Logged in as ${data.user.email}. Opening Admin Data...`);
      window.location.href = "/pages/admin-data.html";
    } catch (error) {
      setLoginStatus("Login failed: " + (error.message || error) + ". Open /pages/supabase-test.html.", false);
    }
  });
});
