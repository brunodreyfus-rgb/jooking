const ADMIN_PASSWORD = "Bruno2026!";
const ADMIN_SESSION_KEY = "antibooking_admin_session";
const ADMIN_REPORTS_KEY = "antibooking_pending_reports";
const ADMIN_APPROVED_KEY = "antibooking_admin_approved_reports";

const sampleReports = [
  {
    id: "R-1001",
    createdAt: "2026-05-04",
    status: "pending",
    place_name: "Example Hotel Submission",
    category: "Hotel",
    country: "Spain",
    city: "Barcelona",
    incident_date: "2026-04-28",
    email: "reporter@example.com",
    evidence_link: "https://example.com/evidence",
    description: "User submitted report awaiting moderation. Replace with real Web3Forms/Supabase records in V2."
  },
  {
    id: "R-1002",
    createdAt: "2026-05-04",
    status: "needs_info",
    place_name: "Example Restaurant Submission",
    category: "Restaurant",
    country: "France",
    city: "Paris",
    incident_date: "2026-04-22",
    email: "source@example.com",
    evidence_link: "",
    description: "Needs more evidence before publication."
  }
];

function ensureReports() {
  const existing = localStorage.getItem(ADMIN_REPORTS_KEY);
  if (!existing) {
    localStorage.setItem(ADMIN_REPORTS_KEY, JSON.stringify(sampleReports));
  }
}

function isLoggedIn() {
  return localStorage.getItem(ADMIN_SESSION_KEY) === "true";
}

function loginAdmin(event) {
  event.preventDefault();
  const password = document.getElementById("adminPassword").value;
  const error = document.getElementById("loginError");

  if (password === ADMIN_PASSWORD) {
    localStorage.setItem(ADMIN_SESSION_KEY, "true");
    renderAdmin();
  } else {
    error.textContent = "Wrong password.";
  }
}

function logoutAdmin() {
  localStorage.removeItem(ADMIN_SESSION_KEY);
  renderAdmin();
}

function getReports() {
  ensureReports();
  return JSON.parse(localStorage.getItem(ADMIN_REPORTS_KEY) || "[]");
}

function setReports(reports) {
  localStorage.setItem(ADMIN_REPORTS_KEY, JSON.stringify(reports));
}

function approveReport(id) {
  const reports = getReports();
  const report = reports.find(item => item.id === id);
  if (!report) return;

  report.status = "approved";

  const approved = JSON.parse(localStorage.getItem(ADMIN_APPROVED_KEY) || "[]");
  approved.push({ ...report, approvedAt: new Date().toISOString().slice(0, 10) });
  localStorage.setItem(ADMIN_APPROVED_KEY, JSON.stringify(approved));

  setReports(reports.filter(item => item.id !== id));
  renderAdmin();
}

function markNeedsInfo(id) {
  const reports = getReports().map(item => item.id === id ? { ...item, status: "needs_info" } : item);
  setReports(reports);
  renderAdmin();
}

function rejectReport(id) {
  setReports(getReports().filter(item => item.id !== id));
  renderAdmin();
}

function mailtoThanks(id) {
  const report = getReports().find(item => item.id === id);
  if (!report) return;

  const subject = encodeURIComponent("AntiBooking - your report has been added");
  const body = encodeURIComponent(`Bonjour,

Merci pour votre ajout concernant ${report.place_name} à ${report.city}.

Votre signalement a été examiné et ajouté à notre base de modération AntiBooking.

Merci pour votre contribution.

AntiBooking`);
  window.location.href = `mailto:${report.email}?subject=${subject}&body=${body}`;
}

function mailtoMoreInfo(id) {
  const report = getReports().find(item => item.id === id);
  if (!report) return;

  const subject = encodeURIComponent("AntiBooking - additional information needed");
  const body = encodeURIComponent(`Bonjour,

Merci pour votre ajout concernant ${report.place_name} à ${report.city}.

Avant de pouvoir publier ce signalement, nous avons besoin d'éléments complémentaires :
- source ou lien de preuve
- date exacte
- description plus détaillée
- capture d'écran ou document si disponible

Merci pour votre aide.

AntiBooking`);
  window.location.href = `mailto:${report.email}?subject=${subject}&body=${body}`;
}

function renderLogin() {
  return `
    <section class="form-section">
      <div class="panel">
        <h2>Admin access</h2>
        <p>This back office is for moderation only. In V2 it should move to Supabase authentication for real security.</p>
        <div class="notice">Prototype password is stored in frontend code. Good for testing, not secure for production.</div>
      </div>
      <form class="panel" onsubmit="loginAdmin(event)">
        <div class="form-grid">
          <div class="input-box full">
            <label>Password</label>
            <input type="password" id="adminPassword" required />
          </div>
          <div class="full">
            <button class="btn btn-primary" style="width:100%; padding:16px;">Login</button>
          </div>
          <p id="loginError" class="full" style="color:#b91c1c; font-weight:900;"></p>
        </div>
      </form>
    </section>
  `;
}

function statusTag(status) {
  if (status === "approved") return '<span class="tag tag-green">Approved</span>';
  if (status === "needs_info") return '<span class="tag tag-gold">Needs info</span>';
  return '<span class="tag tag-red">Pending</span>';
}

function renderReportCard(report) {
  return `
    <article class="incident-card">
      <div class="card-body">
        <div class="tag-row">
          ${statusTag(report.status)}
          <span class="tag">${report.category}</span>
          <span class="tag">${report.country}</span>
        </div>
        <h3>${report.place_name}</h3>
        <p><strong>${report.city}</strong> · Incident date: ${report.incident_date}</p>
        <p>${report.description}</p>
        <p><strong>Reporter:</strong> ${report.email}</p>
        <p><strong>Evidence:</strong> ${report.evidence_link ? `<a href="${report.evidence_link}" target="_blank" rel="noopener noreferrer">Open link</a>` : "No link provided"}</p>
        <div class="form-grid">
          <button class="btn btn-primary" onclick="approveReport('${report.id}')">Approve</button>
          <button class="btn btn-light" onclick="markNeedsInfo('${report.id}')">Needs info</button>
          <button class="btn btn-light" onclick="mailtoMoreInfo('${report.id}')">Ask by email</button>
          <button class="btn btn-light" onclick="mailtoThanks('${report.id}')">Send thanks</button>
          <button class="btn btn-danger full" onclick="rejectReport('${report.id}')">Reject / remove</button>
        </div>
      </div>
    </article>
  `;
}

function renderDashboard() {
  const reports = getReports();
  const approved = JSON.parse(localStorage.getItem(ADMIN_APPROVED_KEY) || "[]");

  return `
    <div class="section-head">
      <div>
        <h2>Moderation Back Office</h2>
        <p>Review submitted reports, approve them, ask for more information, or contact the reporter.</p>
      </div>
      <button class="btn btn-danger" onclick="logoutAdmin()">Logout</button>
    </div>

    <div class="results-grid">
      <article class="incident-card"><div class="card-body"><h3>${reports.length}</h3><p>Pending / needs review</p></div></article>
      <article class="incident-card"><div class="card-body"><h3>${approved.length}</h3><p>Approved in this browser</p></div></article>
      <article class="incident-card"><div class="card-body"><h3>8:00</h3><p>Daily AI scan active in ChatGPT</p></div></article>
    </div>

    <section class="info-band">
      <div>
        <h2>AI Agent for Bruno</h2>
        <p>The daily AI scan is private. It searches the web every morning and returns new leads for you to review before publication.</p>
      </div>
      <div class="steps">
        ${AI_AGENT_QUERIES.map(query => `<div class="step">${query}</div>`).join("")}
      </div>
    </section>

    <div class="section-head">
      <div>
        <h2>Submitted reports</h2>
        <p>Prototype queue stored in browser localStorage. V2 should connect Web3Forms/Supabase so real submissions appear here automatically.</p>
      </div>
    </div>

    <div class="results-grid">
      ${reports.length ? reports.map(renderReportCard).join("") : '<div class="panel"><h2>No pending reports</h2><p>All current reports have been processed.</p></div>'}
    </div>
  `;
}

function renderAdmin() {
  const app = document.getElementById("adminApp");
  if (!app) return;
  app.innerHTML = isLoggedIn() ? renderDashboard() : renderLogin();
}

document.addEventListener("DOMContentLoaded", renderAdmin);
