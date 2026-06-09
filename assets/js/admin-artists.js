/* Jooking Artists Admin */
let artistAdminRows = [];
let currentArtistId = null;

function getArtistAdminClient() {
  if (window.antibookingSupabase) return window.antibookingSupabase;
  if (window.supabaseClient) return window.supabaseClient;
  try { if (typeof antibookingSupabase !== "undefined") return antibookingSupabase; } catch (e) {}
  return null;
}

function clean(value) { return String(value || "").trim(); }
function safeHtml(value) { return String(value || "").replace(/[<>&"]/g, c => ({ "<":"&lt;", ">":"&gt;", "&":"&amp;", '"':"&quot;" }[c])); }

function setArtistAuthBox(message, type = "info") {
  const box = document.getElementById("artistAdminAuthBox");
  if (!box) return;
  box.textContent = message;
  box.style.background = type === "error" ? "#fee2e2" : type === "success" ? "#dcfce7" : "#eef2ff";
  box.style.color = type === "error" ? "#991b1b" : type === "success" ? "#166534" : "#1d4ed8";
}

async function checkArtistAdminSession() {
  const client = getArtistAdminClient();
  if (!client) return setArtistAuthBox("Supabase client not found.", "error");
  const { data } = await client.auth.getSession();
  if (!data?.session) return setArtistAuthBox("Not logged in. Log in through the Admin page first.", "error");
  setArtistAuthBox(`Logged in as ${data.session.user.email}`, "success");
}

async function loadArtistAdminRows() {
  const client = getArtistAdminClient();
  const list = document.getElementById("artistAdminRows");
  if (!client || !list) return;
  list.textContent = "Loading...";

  const { data, error } = await client
    .from("artists")
    .select("*")
    .order("created_at", { ascending: false })
    .range(0, 999);

  if (error) {
    list.textContent = `Error: ${error.message}. Did you run pages/setup-artists.sql in Supabase?`;
    return;
  }

  artistAdminRows = Array.isArray(data) ? data : [];
  renderArtistAdminRows();
}

function getFilteredArtistRows() {
  const q = clean(document.getElementById("artistAdminSearch")?.value).toLowerCase();
  const status = document.getElementById("artistAdminStatusFilter")?.value || "all";
  const position = document.getElementById("artistAdminPositionFilter")?.value || "all";

  return artistAdminRows.filter(row => {
    if (status !== "all" && clean(row.status) !== status) return false;
    if (position !== "all" && clean(row.position_type) !== position) return false;
    if (q && !JSON.stringify(row).toLowerCase().includes(q)) return false;
    return true;
  });
}

function renderArtistAdminRows() {
  const list = document.getElementById("artistAdminRows");
  const stats = document.getElementById("artistAdminStats");
  if (!list) return;

  const rows = getFilteredArtistRows();
  const approved = artistAdminRows.filter(r => clean(r.status) === "approved").length;
  const needs = artistAdminRows.filter(r => clean(r.status) === "needs_verification").length;

  if (stats) {
    stats.innerHTML = `<span class="admin-stat-pill green">${artistAdminRows.length} total</span><span class="admin-stat-pill green">${approved} approved</span><span class="admin-stat-pill warn">${needs} needs verification</span><span class="admin-stat-pill">${rows.length} shown</span>`;
  }

  if (!rows.length) {
    list.textContent = "No artist records match these filters.";
    return;
  }

  list.innerHTML = rows.map(row => `
    <div class="admin-item" onclick="editArtistRecord('${row.id}')">
      <strong>${safeHtml(row.artist_name || "Unnamed artist")}</strong>
      <span>${safeHtml([row.status, row.position_type, row.profession, row.country].filter(Boolean).join(" · "))}</span>
      <div class="admin-item-flags">
        <span class="admin-flag ${clean(row.status) === "approved" ? "ok" : "warn"}">${safeHtml(row.status || "no status")}</span>
        ${!clean(row.source_url) ? '<span class="admin-flag bad">missing source url</span>' : ""}
        ${!clean(row.photo_url) ? '<span class="admin-flag bad">missing photo</span>' : ""}
      </div>
    </div>
  `).join("");
}

function editArtistRecord(id) {
  const row = artistAdminRows.find(r => String(r.id) === String(id));
  if (!row) return;

  currentArtistId = id;
  const form = document.getElementById("artistAdminForm");
  form.elements.id.value = row.id || "";
  form.elements.status.value = row.status || "needs_verification";
  form.elements.artist_name.value = row.artist_name || "";
  form.elements.photo_url.value = row.photo_url || "";
  form.elements.country.value = row.country || "";
  form.elements.profession.value = row.profession || "";
  form.elements.category.value = row.category || "";
  form.elements.position_type.value = row.position_type || "Other";
  form.elements.bio.value = row.bio || "";
  form.elements.statement_summary.value = row.statement_summary || "";
  form.elements.exact_quote.value = row.exact_quote || "";
  form.elements.source_label.value = row.source_label || "";
  form.elements.source_date.value = row.source_date || "";
  form.elements.source_url.value = row.source_url || "";

  document.getElementById("artistAdminFormTitle").textContent = `Editing: ${row.artist_name || "artist"}`;
  document.getElementById("artistAdminSaveStatus").textContent = "";
}

function clearArtistAdminForm() {
  currentArtistId = null;
  const form = document.getElementById("artistAdminForm");
  if (!form) return;
  form.reset();
  form.elements.status.value = "needs_verification";
  document.getElementById("artistAdminFormTitle").textContent = "New artist record";
  document.getElementById("artistAdminSaveStatus").textContent = "";
}

function artistFormPayload() {
  const form = document.getElementById("artistAdminForm");
  return {
    status: form.elements.status.value,
    artist_name: clean(form.elements.artist_name.value),
    photo_url: clean(form.elements.photo_url.value) || null,
    country: clean(form.elements.country.value) || null,
    profession: clean(form.elements.profession.value) || null,
    category: clean(form.elements.category.value) || null,
    position_type: clean(form.elements.position_type.value) || "Other",
    bio: clean(form.elements.bio.value) || null,
    statement_summary: clean(form.elements.statement_summary.value) || null,
    exact_quote: clean(form.elements.exact_quote.value) || null,
    source_label: clean(form.elements.source_label.value) || null,
    source_date: clean(form.elements.source_date.value) || null,
    source_url: clean(form.elements.source_url.value) || null
  };
}

async function saveArtistRecord(event) {
  event.preventDefault();
  const client = getArtistAdminClient();
  const status = document.getElementById("artistAdminSaveStatus");
  if (!client || !status) return;

  const payload = artistFormPayload();
  status.textContent = "Saving...";

  const result = currentArtistId
    ? await client.from("artists").update(payload).eq("id", currentArtistId).select()
    : await client.from("artists").insert(payload).select();

  if (result.error) {
    status.textContent = `Error: ${result.error.message}`;
    status.style.color = "#dc2626";
    return;
  }

  status.textContent = "Saved.";
  status.style.color = "#15803d";
  await loadArtistAdminRows();

  if (!currentArtistId && result.data?.[0]?.id) editArtistRecord(result.data[0].id);
}

async function deleteArtistRecord() {
  if (!currentArtistId) return alert("Select an artist first.");
  if (!confirm("Delete this artist record?")) return;

  const client = getArtistAdminClient();
  const { error } = await client.from("artists").delete().eq("id", currentArtistId);

  if (error) return alert(error.message);

  clearArtistAdminForm();
  await loadArtistAdminRows();
}

document.addEventListener("DOMContentLoaded", async () => {
  document.getElementById("artistAdminForm")?.addEventListener("submit", saveArtistRecord);
  await checkArtistAdminSession();
  await loadArtistAdminRows();
});
