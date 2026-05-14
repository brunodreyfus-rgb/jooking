let currentTable = "incidents";
let adminRows = [];
let currentRecordId = null;

function getAdminClient() {
  if (window.antibookingSupabase) return window.antibookingSupabase;
  if (window.supabaseClient) return window.supabaseClient;
  try { if (typeof antibookingSupabase !== "undefined") return antibookingSupabase; } catch(e) {}
  return null;
}

function setAuthBox(message, type = "info") {
  const box = document.getElementById("adminAuthBox");
  if (!box) return;
  box.textContent = message;
  box.style.background = type === "error" ? "#fee2e2" : type === "success" ? "#dcfce7" : "#eef2ff";
  box.style.color = type === "error" ? "#991b1b" : type === "success" ? "#166534" : "#1d4ed8";
}

async function checkAdminSession() {
  const client = getAdminClient();
  if (!client) return setAuthBox("Supabase client not found.", "error");
  const { data } = await client.auth.getSession();
  if (!data?.session) return setAuthBox("Not logged in. Log in through /pages/admin.html first.", "error");
  setAuthBox(`Logged in as ${data.session.user.email}`, "success");
}

function switchAdminTable(table) {
  currentTable = table;
  currentRecordId = null;
  document.querySelectorAll(".admin-tab").forEach(btn => btn.classList.remove("active"));
  const label = table === "incidents" ? "risks" : table === "friendly_places" ? "friendly" : "ai";
  [...document.querySelectorAll(".admin-tab")].find(btn => btn.textContent.toLowerCase().includes(label))?.classList.add("active");
  document.body.classList.toggle("admin-friendly", table === "friendly_places");
  document.getElementById("adminFormTitle").textContent = table === "friendly_places" ? "New friendly place" : table === "ai_leads" ? "AI lead" : "New risk report";
  document.getElementById("adminListTitle").textContent = table === "friendly_places" ? "Friendly Places" : table === "ai_leads" ? "AI Leads" : "Risks / Incidents";
  clearAdminForm();
  loadAdminRows();
}

async function loadAdminRows() {
  const client = getAdminClient();
  const list = document.getElementById("adminRows");
  if (!client || !list) return;
  list.textContent = "Loading...";
  const { data, error } = await client.from(currentTable).select("*").order("created_at", { ascending: false });
  if (error) { list.textContent = `Error: ${error.message}`; return; }
  adminRows = Array.isArray(data) ? data : [];
  renderAdminRows();
}

function renderAdminRows() {
  const list = document.getElementById("adminRows");
  const search = String(document.getElementById("adminSearch")?.value || "").toLowerCase();
  const rows = adminRows.filter(row => JSON.stringify(row).toLowerCase().includes(search));
  if (!rows.length) { list.textContent = "No rows found."; return; }
  list.innerHTML = rows.map(row => {
    const name = row.place_name || row.name || "Unnamed";
    const meta = [row.status, row.category, row.city, row.country].filter(Boolean).join(" · ");
    return `<div class="admin-item" onclick="editAdminRecord('${row.id}')"><strong>${escapeHtml(name)}</strong><span>${escapeHtml(meta)}</span></div>`;
  }).join("");
}

function editAdminRecord(id) {
  const row = adminRows.find(r => String(r.id) === String(id));
  if (!row) return;
  currentRecordId = id;
  const f = document.getElementById("adminDataForm");
  f.elements.id.value = row.id || "";
  f.elements.status.value = row.status || (currentTable === "ai_leads" ? "needs_verification" : "approved");
  f.elements.place_name.value = row.place_name || row.name || "";
  f.elements.category.value = row.category || "";
  f.elements.country.value = row.country || "";
  f.elements.city.value = row.city || "";
  f.elements.incident_date.value = row.incident_date || "";
  f.elements.confidence.value = row.confidence || row.evidence_quality || "";
  f.elements.summary.value = row.summary || "";
  f.elements.details.value = row.details || row.publish_recommendation || "";
  f.elements.source_label.value = row.source_label || "";
  f.elements.source_url.value = row.source_url || "";
  f.elements.website.value = row.website || "";
  f.elements.badge.value = row.badge || "";
  document.getElementById("adminFormTitle").textContent = `Editing: ${row.place_name || row.name || "record"}`;
}

function clearAdminForm() {
  currentRecordId = null;
  const f = document.getElementById("adminDataForm");
  if (!f) return;
  f.reset();
  f.elements.status.value = currentTable === "ai_leads" ? "needs_verification" : "approved";
  f.elements.id.value = "";
  document.getElementById("adminSaveStatus").textContent = "";
}

function formToPayload() {
  const f = document.getElementById("adminDataForm");
  if (currentTable === "friendly_places") return {
    status:f.elements.status.value, place_name:f.elements.place_name.value, category:f.elements.category.value, country:f.elements.country.value, city:f.elements.city.value,
    confidence:f.elements.confidence.value, summary:f.elements.summary.value, details:f.elements.details.value, source_label:f.elements.source_label.value, source_url:f.elements.source_url.value,
    website:f.elements.website.value, badge:f.elements.badge.value
  };
  if (currentTable === "ai_leads") return {
    status:f.elements.status.value, place_name:f.elements.place_name.value, category:f.elements.category.value, country:f.elements.country.value, city:f.elements.city.value, incident_date:f.elements.incident_date.value || null,
    summary:f.elements.summary.value, details:f.elements.details.value, source_label:f.elements.source_label.value, source_url:f.elements.source_url.value, evidence_quality:f.elements.confidence.value, publish_recommendation:f.elements.details.value
  };
  return {
    status:f.elements.status.value, tourism_type:"tourism_direct", confidence:f.elements.confidence.value, place_name:f.elements.place_name.value, category:f.elements.category.value, country:f.elements.country.value, city:f.elements.city.value,
    incident_date:f.elements.incident_date.value || null, summary:f.elements.summary.value, details:f.elements.details.value, source_label:f.elements.source_label.value, source_url:f.elements.source_url.value
  };
}

async function saveAdminRecord(event) {
  event.preventDefault();
  const client = getAdminClient();
  const status = document.getElementById("adminSaveStatus");
  const payload = formToPayload();
  status.textContent = "Saving...";
  const response = currentRecordId
    ? await client.from(currentTable).update(payload).eq("id", currentRecordId).select()
    : await client.from(currentTable).insert(payload).select();
  if (response.error) { status.textContent = `Error: ${response.error.message}`; status.style.color = "#dc2626"; return; }
  status.textContent = "Saved."; status.style.color = "#15803d";
  await loadAdminRows();
  if (!currentRecordId && response.data?.[0]?.id) editAdminRecord(response.data[0].id);
}

async function deleteCurrentRecord() {
  if (!currentRecordId) return alert("Select a row first.");
  if (!confirm("Delete this record?")) return;
  const client = getAdminClient();
  const { error } = await client.from(currentTable).delete().eq("id", currentRecordId);
  if (error) return alert(error.message);
  clearAdminForm();
  await loadAdminRows();
}

function escapeHtml(value) {
  return String(value || "").replace(/[<>&"]/g, c => ({ "<":"&lt;", ">":"&gt;", "&":"&amp;", '"':"&quot;" }[c]));
}

document.addEventListener("DOMContentLoaded", async () => {
  document.getElementById("adminDataForm")?.addEventListener("submit", saveAdminRecord);
  await checkAdminSession();
  await loadAdminRows();
});
