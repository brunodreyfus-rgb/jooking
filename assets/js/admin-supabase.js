let currentAdminUser = null;
let currentReports = [];
let currentAiLeads = [];
let currentIncidents = [];

async function getSession() {
  const { data } = await antibookingSupabase.auth.getSession();
  return data.session;
}

async function checkAdmin() {
  const session = await getSession();
  currentAdminUser = session?.user || null;
  if (!currentAdminUser) return renderLogin();
  renderDashboardShell();
  await Promise.all([loadReports(), loadAiLeads(), loadIncidents()]);
}

async function loginAdmin(event) {
  event.preventDefault();
  const email = byId("adminEmail").value.trim();
  const password = byId("adminPassword").value;
  const error = byId("loginError");
  error.textContent = "Logging in...";

  const { error: loginError } = await antibookingSupabase.auth.signInWithPassword({ email, password });
  if (loginError) {
    error.textContent = loginError.message;
    return;
  }

  await checkAdmin();
}

async function logoutAdmin() {
  await antibookingSupabase.auth.signOut();
  currentAdminUser = null;
  renderLogin();
}

function renderLogin() {
  byId("adminApp").innerHTML = `
    <section class="form-section">
      <div class="panel">
        <h2>Secure admin login</h2>
        <p>Use the Supabase admin user created for AntiBooking moderation.</p>
        <div class="notice">Only bruno.dreyfus@gmail.com can read and moderate reports via RLS.</div>
      </div>
      <form class="panel" onsubmit="loginAdmin(event)">
        <div class="form-grid">
          <div class="input-box full"><label>Email</label><input type="email" id="adminEmail" value="bruno.dreyfus@gmail.com" required /></div>
          <div class="input-box full"><label>Password</label><input type="password" id="adminPassword" required /></div>
          <div class="full"><button class="btn btn-primary" style="width:100%; padding:16px;">Login</button></div>
          <p id="loginError" class="full" style="color:#b91c1c; font-weight:900;"></p>
        </div>
      </form>
    </section>`;
}

function renderDashboardShell() {
  byId("adminApp").innerHTML = `
    <div class="section-head">
      <div><h2>Moderation Back Office</h2><p>Logged in as ${safeText(currentAdminUser.email)}.</p></div>
      <button class="btn btn-danger" onclick="logoutAdmin()">Logout</button>
    </div>

    <div class="results-grid" id="adminStats"></div>

    <section class="info-band">
      <div>
        <h2>Admin Editor</h2>
        <p>You can now edit published incidents directly: place name, city, source, confidence, status, summary and details.</p>
      </div>
      <div class="steps">
        <div class="step">AI Leads → Import to reports</div>
        <div class="step">Reports → Approve & publish</div>
        <div class="step">Published incidents → Edit / archive</div>
        <div class="step">Homepage updates live from Supabase</div>
      </div>
    </section>

    <div class="section-head">
      <div><h2>Submitted reports</h2><p>Live data from Supabase reports.</p></div>
      <button class="btn btn-primary" onclick="loadReports()">Refresh reports</button>
    </div>
    <div class="results-grid" id="reportsGrid"></div>

    <div class="section-head">
      <div><h2>AI Leads</h2><p>Research leads from your daily scan and user-provided sources.</p></div>
      <button class="btn btn-primary" onclick="loadAiLeads()">Refresh AI leads</button>
    </div>
    <div class="results-grid" id="aiLeadsGrid"></div>

    <div class="section-head">
      <div><h2>Published incidents editor</h2><p>Edit public incidents directly without SQL. Use archive instead of delete when unsure.</p></div>
      <button class="btn btn-primary" onclick="loadIncidents()">Refresh incidents</button>
    </div>
    <div class="results-grid" id="incidentsGrid"></div>
  `;
}

async function loadReports() {
  const grid = byId("reportsGrid");
  if (!grid) return;
  grid.innerHTML = '<div class="panel"><h2>Loading reports...</h2></div>';

  const { data, error } = await antibookingSupabase
    .from("reports")
    .select("*")
    .in("status", ["pending", "needs_info"])
    .order("created_at", { ascending: false });

  if (error) {
    grid.innerHTML = `<div class="panel"><h2>Error</h2><p>${safeText(error.message)}</p></div>`;
    return;
  }

  currentReports = data || [];
  renderStats();
  grid.innerHTML = currentReports.length
    ? currentReports.map(renderReportCard).join("")
    : '<div class="panel"><h2>No pending reports</h2><p>All reports have been processed.</p></div>';
}

async function loadAiLeads() {
  const grid = byId("aiLeadsGrid");
  if (!grid) return;
  grid.innerHTML = '<div class="panel"><h2>Loading AI leads...</h2></div>';

  const { data, error } = await antibookingSupabase
    .from("ai_leads")
    .select("*")
    .in("status", ["new", "needs_verification"])
    .order("created_at", { ascending: false });

  if (error) {
    grid.innerHTML = `<div class="panel"><h2>AI leads not ready</h2><p>${safeText(error.message)}</p><p>Run pages/setup-ai-leads-v2-2.sql in Supabase.</p></div>`;
    return;
  }

  currentAiLeads = data || [];
  renderStats();
  grid.innerHTML = currentAiLeads.length
    ? currentAiLeads.map(renderAiLeadCard).join("")
    : '<div class="panel"><h2>No AI leads</h2><p>Add new leads from the daily scan to Supabase.</p></div>';
}

async function loadIncidents() {
  const grid = byId("incidentsGrid");
  if (!grid) return;
  grid.innerHTML = '<div class="panel"><h2>Loading published incidents...</h2></div>';

  const { data, error } = await antibookingSupabase
    .from("incidents")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    grid.innerHTML = `<div class="panel"><h2>Error loading incidents</h2><p>${safeText(error.message)}</p></div>`;
    return;
  }

  currentIncidents = data || [];
  renderStats();
  grid.innerHTML = currentIncidents.length
    ? currentIncidents.map(renderIncidentEditorCard).join("")
    : '<div class="panel"><h2>No published incidents</h2><p>Approve reports to populate the public site.</p></div>';
}

function renderStats() {
  const stats = byId("adminStats");
  if (!stats) return;

  stats.innerHTML = `
    <article class="incident-card"><div class="card-body"><h3>${currentReports.length}</h3><p>Pending reports</p></div></article>
    <article class="incident-card"><div class="card-body"><h3>${currentAiLeads.length}</h3><p>AI leads</p></div></article>
    <article class="incident-card"><div class="card-body"><h3>${currentIncidents.length}</h3><p>Published incidents</p></div></article>`;
}

function renderReportCard(report) {
  const evidence = report.evidence_file_url || report.evidence_link;
  return `
    <article class="incident-card"><div class="card-body">
      <div class="tag-row"><span class="tag tag-red">${safeText(report.status)}</span><span class="tag">${safeText(report.category)}</span><span class="tag">${safeText(report.country)}</span></div>
      <h3>${safeText(report.place_name)}</h3>
      <p><strong>${safeText(report.city)}</strong> · Incident date: ${safeText(report.incident_date || "Unknown")}</p>
      <p>${safeText(report.description)}</p>
      <p><strong>Reporter:</strong> ${safeText(report.reporter_email)}</p>
      <p><strong>Evidence:</strong> ${evidence ? `<a href="${safeAttr(evidence)}" target="_blank" rel="noopener noreferrer">Open link</a>` : "No evidence provided"}</p>
      <div class="input-box full" style="margin-bottom:12px;"><label>Moderator notes</label><textarea id="notes-${report.id}">${safeText(report.moderator_notes || "")}</textarea></div>
      <div class="form-grid">
        <button class="btn btn-primary" onclick="approveReport('${report.id}')">Approve & publish</button>
        <button class="btn btn-light" onclick="markNeedsInfo('${report.id}')">Needs info</button>
        <button class="btn btn-light" onclick="mailtoMoreInfo('${report.id}')">Ask by email</button>
        <button class="btn btn-light" onclick="mailtoThanks('${report.id}')">Send thanks</button>
        <button class="btn btn-danger full" onclick="rejectReport('${report.id}')">Reject</button>
      </div>
    </div></article>`;
}

function renderAiLeadCard(lead) {
  return `
    <article class="incident-card"><div class="card-body">
      <div class="tag-row"><span class="tag tag-gold">${safeText(lead.status)}</span><span class="tag">${safeText(lead.category)}</span><span class="tag">${safeText(lead.country)}</span></div>
      <h3>${safeText(lead.place_name || "Unnamed place")}</h3>
      <p><strong>${safeText(lead.city || "City unknown")}</strong> · Incident date: ${safeText(lead.incident_date || "Unknown")}</p>
      <p>${safeText(lead.summary)}</p>
      <p>${safeText(lead.details || "")}</p>
      <p><strong>Evidence quality:</strong> ${safeText(lead.evidence_quality || "Not rated")}</p>
      <p><strong>Recommendation:</strong> ${safeText(lead.publish_recommendation || "Needs review")}</p>
      <p><strong>Source:</strong> ${lead.source_url ? `<a href="${safeAttr(lead.source_url)}" target="_blank" rel="noopener noreferrer">${safeText(lead.source_label || "Open source")}</a>` : safeText(lead.source_label || "No source URL")}</p>
      <div class="input-box full" style="margin-bottom:12px;"><label>AI lead notes</label><textarea id="lead-notes-${lead.id}">${safeText(lead.moderator_notes || "")}</textarea></div>
      <div class="form-grid">
        <button class="btn btn-primary" onclick="importAiLeadToReport('${lead.id}')">Import to reports</button>
        <button class="btn btn-light" onclick="markAiLeadNeedsVerification('${lead.id}')">Needs verification</button>
        <button class="btn btn-danger" onclick="rejectAiLead('${lead.id}')">Reject lead</button>
      </div>
    </div></article>`;
}

function renderIncidentEditorCard(incident) {
  const id = incident.id;
  return `
    <article class="incident-card">
      <div class="card-body">
        <div class="tag-row">
          <span class="tag ${incident.status === "approved" ? "tag-green" : "tag-gold"}">${safeText(incident.status)}</span>
          <span class="tag">${safeText(incident.category)}</span>
          <span class="tag">${safeText(incident.country)}</span>
        </div>

        <div class="form-grid">
          <div class="input-box full"><label>Place name</label><input id="inc-place-${id}" value="${safeAttr(incident.place_name || "")}" /></div>

          <div class="input-box"><label>Category</label>
            <select id="inc-category-${id}">
              ${optionList(["Hotel", "Restaurant", "Taxi / Transport", "Museum / Attraction", "Airbnb / Rental", "Airport Service", "Other"], incident.category)}
            </select>
          </div>

          <div class="input-box"><label>Status</label>
            <select id="inc-status-${id}">
              ${optionList(["approved", "under_review", "archived"], incident.status)}
            </select>
          </div>

          <div class="input-box"><label>Country</label><input id="inc-country-${id}" value="${safeAttr(incident.country || "")}" /></div>
          <div class="input-box"><label>City</label><input id="inc-city-${id}" value="${safeAttr(incident.city || "")}" /></div>
          <div class="input-box"><label>Incident date</label><input type="date" id="inc-date-${id}" value="${safeAttr(incident.incident_date || "")}" /></div>

          <div class="input-box"><label>Tourism type</label>
            <select id="inc-tourism-${id}">
              ${optionList(["tourism_direct", "tourism_related", "context_only"], incident.tourism_type)}
            </select>
          </div>

          <div class="input-box full"><label>Confidence</label>
            <select id="inc-confidence-${id}">
              ${optionList([
                "Verified media",
                "Media report",
                "Media report + video",
                "Video evidence",
                "User report - approved by admin",
                "Needs verification",
                "Low confidence",
                incident.confidence || ""
              ].filter(Boolean), incident.confidence)}
            </select>
          </div>

          <div class="input-box full"><label>Summary</label><textarea id="inc-summary-${id}">${safeText(incident.summary || "")}</textarea></div>
          <div class="input-box full"><label>Details</label><textarea id="inc-details-${id}">${safeText(incident.details || "")}</textarea></div>
          <div class="input-box"><label>Source label</label><input id="inc-source-label-${id}" value="${safeAttr(incident.source_label || "")}" /></div>
          <div class="input-box"><label>Source URL</label><input id="inc-source-url-${id}" value="${safeAttr(incident.source_url || "")}" /></div>

          <div class="full" id="inc-status-message-${id}" style="font-weight:900;"></div>

          <button class="btn btn-primary" onclick="saveIncident('${id}')">Save changes</button>
          <button class="btn btn-light" onclick="setIncidentStatus('${id}', 'under_review')">Mark under review</button>
          <button class="btn btn-danger" onclick="setIncidentStatus('${id}', 'archived')">Archive</button>
        </div>
      </div>
    </article>`;
}

function optionList(options, selected) {
  const unique = [...new Set(options)];
  return unique.map(option => {
    const isSelected = String(option) === String(selected) ? "selected" : "";
    return `<option value="${safeAttr(option)}" ${isSelected}>${safeText(option)}</option>`;
  }).join("");
}

function findReport(id) { return currentReports.find(report => report.id === id); }
function findAiLead(id) { return currentAiLeads.find(lead => lead.id === id); }

async function importAiLeadToReport(id) {
  const lead = findAiLead(id);
  if (!lead) return;
  const notes = byId(`lead-notes-${id}`)?.value || "";

  const { error: insertError } = await antibookingSupabase.from("reports").insert({
    status: "pending",
    place_name: lead.place_name || "Unnamed place",
    category: lead.category,
    country: lead.country,
    city: lead.city || "Unknown",
    incident_date: lead.incident_date || null,
    reporter_email: currentAdminUser.email,
    evidence_link: lead.source_url || null,
    description: `${lead.summary}\n\n${lead.details || ""}\n\nEvidence quality: ${lead.evidence_quality || ""}\nRecommendation: ${lead.publish_recommendation || ""}`,
    publication_consent: "AI lead imported by admin for moderation",
    moderator_notes: notes
  });

  if (insertError) return alert("Error importing AI lead: " + insertError.message);

  const { error: updateError } = await antibookingSupabase
    .from("ai_leads")
    .update({ status: "imported", moderator_notes: notes })
    .eq("id", id);

  if (updateError) return alert("Lead imported, but status update failed: " + updateError.message);
  await Promise.all([loadReports(), loadAiLeads()]);
}

async function markAiLeadNeedsVerification(id) {
  const notes = byId(`lead-notes-${id}`)?.value || "";
  const { error } = await antibookingSupabase
    .from("ai_leads")
    .update({ status: "needs_verification", moderator_notes: notes })
    .eq("id", id);

  if (error) return alert(error.message);
  await loadAiLeads();
}

async function rejectAiLead(id) {
  const notes = byId(`lead-notes-${id}`)?.value || "";
  const { error } = await antibookingSupabase
    .from("ai_leads")
    .update({ status: "rejected", moderator_notes: notes })
    .eq("id", id);

  if (error) return alert(error.message);
  await loadAiLeads();
}

async function approveReport(id) {
  const report = findReport(id);
  if (!report) return;
  const notes = byId(`notes-${id}`)?.value || "";

  const { error: insertError } = await antibookingSupabase.from("incidents").insert({
    source_report_id: report.id,
    status: "approved",
    tourism_type: "tourism_direct",
    confidence: "User report - approved by admin",
    place_name: report.place_name,
    category: report.category,
    country: report.country,
    city: report.city,
    incident_date: report.incident_date,
    summary: report.description.slice(0, 180),
    details: report.description,
    source_label: report.evidence_link ? "Submitted evidence link" : "Submitted user report",
    source_url: report.evidence_link,
    evidence_file_url: report.evidence_file_url
  });

  if (insertError) return alert("Error publishing incident: " + insertError.message);

  const { error: updateError } = await antibookingSupabase
    .from("reports")
    .update({ status: "approved", moderator_notes: notes })
    .eq("id", id);

  if (updateError) return alert(updateError.message);
  await Promise.all([loadReports(), loadIncidents()]);
}

async function markNeedsInfo(id) {
  const notes = byId(`notes-${id}`)?.value || "";
  const { error } = await antibookingSupabase
    .from("reports")
    .update({ status: "needs_info", moderator_notes: notes })
    .eq("id", id);

  if (error) return alert(error.message);
  await loadReports();
}

async function rejectReport(id) {
  const notes = byId(`notes-${id}`)?.value || "";
  const { error } = await antibookingSupabase
    .from("reports")
    .update({ status: "rejected", moderator_notes: notes })
    .eq("id", id);

  if (error) return alert(error.message);
  await loadReports();
}

async function saveIncident(id) {
  const message = byId(`inc-status-message-${id}`);
  if (message) {
    message.textContent = "Saving...";
    message.style.color = "#64748b";
  }

  const payload = {
    place_name: byId(`inc-place-${id}`).value.trim(),
    category: byId(`inc-category-${id}`).value,
    status: byId(`inc-status-${id}`).value,
    country: byId(`inc-country-${id}`).value.trim(),
    city: byId(`inc-city-${id}`).value.trim(),
    incident_date: byId(`inc-date-${id}`).value || null,
    tourism_type: byId(`inc-tourism-${id}`).value,
    confidence: byId(`inc-confidence-${id}`).value,
    summary: byId(`inc-summary-${id}`).value.trim(),
    details: byId(`inc-details-${id}`).value.trim(),
    source_label: byId(`inc-source-label-${id}`).value.trim() || null,
    source_url: byId(`inc-source-url-${id}`).value.trim() || null
  };

  const { error } = await antibookingSupabase
    .from("incidents")
    .update(payload)
    .eq("id", id);

  if (error) {
    if (message) {
      message.textContent = "Error: " + error.message;
      message.style.color = "#b91c1c";
    }
    return;
  }

  if (message) {
    message.textContent = "Saved.";
    message.style.color = "#15803d";
  }

  await loadIncidents();
}

async function setIncidentStatus(id, status) {
  const { error } = await antibookingSupabase
    .from("incidents")
    .update({ status })
    .eq("id", id);

  if (error) return alert(error.message);
  await loadIncidents();
}

function mailtoThanks(id) {
  const report = findReport(id);
  const subject = encodeURIComponent("AntiBooking - your report has been added");
  const body = encodeURIComponent(`Bonjour,\n\nMerci pour votre ajout concernant ${report.place_name} à ${report.city}.\n\nVotre signalement a été examiné et ajouté à notre base AntiBooking.\n\nMerci pour votre contribution.\n\nAntiBooking`);
  window.location.href = `mailto:${report.reporter_email}?subject=${subject}&body=${body}`;
}

function mailtoMoreInfo(id) {
  const report = findReport(id);
  const subject = encodeURIComponent("AntiBooking - additional information needed");
  const body = encodeURIComponent(`Bonjour,\n\nMerci pour votre ajout concernant ${report.place_name} à ${report.city}.\n\nAvant de pouvoir publier ce signalement, nous avons besoin d'éléments complémentaires : source, date exacte, description plus détaillée, capture d'écran ou document.\n\nMerci.\n\nAntiBooking`);
  window.location.href = `mailto:${report.reporter_email}?subject=${subject}&body=${body}`;
}

function safeAttr(value) {
  return safeText(value).replace(/'/g, "&#39;");
}

document.addEventListener("DOMContentLoaded", checkAdmin);
