const countrySelect = document.getElementById("countrySelect");
const citySelect = document.getElementById("citySelect");
const categorySelect = document.getElementById("categorySelect");
const resultsGrid = document.getElementById("resultsGrid");
const emptyState = document.getElementById("emptyState");
const resultCount = document.getElementById("resultCount");

let currentPublicIncidents = [];

async function initFilters() {
  if (!countrySelect || !citySelect || !categorySelect || !resultsGrid) return;
  resultsGrid.innerHTML = '<div class="panel"><h2>Loading approved incidents...</h2></div>';
  currentPublicIncidents = await getPublicIncidents();

  const countries = [...new Set(currentPublicIncidents.map(item => item.country))].sort();
  countrySelect.innerHTML = '<option value="all">All countries</option>';
  countries.forEach(country => {
    const option = document.createElement("option");
    option.value = country;
    option.textContent = country;
    countrySelect.appendChild(option);
  });

  ensureCategoryOption("Harassment / Atmosphere", "Harassment / Atmosphere");
  countrySelect.addEventListener("change", updateCities);
  categorySelect.addEventListener("change", filterIncidents);
  updateCities();
  renderCategoryTiles();
  renderResults(currentPublicIncidents);
}

function ensureCategoryOption(value, label) {
  if (![...categorySelect.options].some(option => option.value === value)) {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = label;
    categorySelect.appendChild(option);
  }
}

function updateCities() {
  const selectedCountry = countrySelect.value;
  const cities = [...new Set(currentPublicIncidents.filter(item => selectedCountry === "all" || item.country === selectedCountry).map(item => item.city))].sort();
  citySelect.innerHTML = '<option value="all">All cities</option>';
  cities.forEach(city => {
    const option = document.createElement("option");
    option.value = city;
    option.textContent = city;
    citySelect.appendChild(option);
  });
  filterIncidents();
}

function filterIncidents() {
  const country = countrySelect.value;
  const city = citySelect.value;
  const category = categorySelect.value;
  renderResults(currentPublicIncidents.filter(item =>
    (country === "all" || item.country === country) &&
    (city === "all" || item.city === city) &&
    (category === "all" || item.category === category)
  ));
}

function renderResults(items) {
  resultsGrid.innerHTML = "";
  if (!items.length) {
    emptyState.style.display = "block";
    resultCount.textContent = "No approved incidents found yet.";
    return;
  }
  emptyState.style.display = "none";
  resultCount.textContent = `Showing ${items.length} approved / real-source result${items.length > 1 ? "s" : ""}.`;

  items.forEach(item => {
    const score = riskScore(item);
    const card = document.createElement("article");
    card.className = "incident-card result-card";
    card.innerHTML = `
      <div class="card-image"><img src="${getCategoryImage(item.category)}" alt="${safeHtml(item.category)}" /></div>
      <div class="card-body">
        <div class="tag-row">
          <span class="tag">${safeHtml(item.category)}</span>
          <span class="tag ${trustClass(item.confidence)}">${safeHtml(trustLabel(item.confidence))}</span>
          <span class="tag tag-green">Approved</span>
        </div>
        <h3>${safeHtml(item.name)}</h3>
        <p>${safeHtml(item.summary)}</p>
        <div class="meta">
          <span>${safeHtml(item.city)}, ${safeHtml(item.country)}</span>
          <span>${formatDate(item.date)}</span>
        </div>
      </div>
      <div class="card-side">
        <div>
          <div class="score-label">Risk signal</div>
          <div class="score-value">${score}.0</div>
          ${riskBars(score)}
          <p style="font-size:12px;margin:0;color:#5b6575;">Based on source confidence</p>
        </div>
        <div>
          <button class="btn btn-primary" onclick="openIncident('${item.id}')" style="width:100%;margin-bottom:10px;">View details ›</button>
          <button class="btn btn-light" onclick="openCommentModal('${item.id}')" style="width:100%;">Comment</button>
        </div>
      </div>`;
    resultsGrid.appendChild(card);
  });
}

function renderCategoryTiles() {
  const box = document.getElementById("categoryStrip");
  if (!box) return;
  const cats = [["Hotel","Hotels"],["Restaurant","Restaurants"],["Taxi / Transport","Taxi / Transport"],["Museum / Attraction","Attractions"],["Airbnb / Rental","Rentals"],["Airport Service","Airport Services"],["Harassment / Atmosphere","Harassment / Atmosphere"]];
  box.innerHTML = cats.map(([value, label]) => `
    <button class="category-tile" onclick="selectCategory('${value.replace(/'/g, "\\'")}')">
      <img src="${getCategoryImage(value)}" alt="${safeHtml(label)}" />
      <strong>${safeHtml(label)}</strong>
    </button>`).join("");
}

function selectCategory(category) {
  categorySelect.value = category;
  filterIncidents();
  document.getElementById("search").scrollIntoView({ behavior: "smooth" });
}

function openIncident(id) {
  const item = currentPublicIncidents.find(i => String(i.id) === String(id));
  if (!item) return;
  const sources = (item.sources || []).map(source => !source.url || source.url === "#" ? `<li>${safeHtml(source.label)}</li>` : `<li><a href="${safeAttr(source.url)}" target="_blank" rel="noopener noreferrer">${safeHtml(source.label)}</a></li>`).join("");
  document.getElementById("modalContent").innerHTML = `
    <div class="tag-row"><span class="tag">${safeHtml(item.category)}</span><span class="tag ${trustClass(item.confidence)}">${safeHtml(trustLabel(item.confidence))}</span><span class="tag tag-green">Approved</span></div>
    <h2>${safeHtml(item.name)}</h2>
    <p><strong>Location:</strong> ${safeHtml(item.city)}, ${safeHtml(item.country)}</p>
    <p><strong>Incident date:</strong> ${formatDate(item.date)}</p>
    <p>${safeHtml(item.details)}</p>
    <div class="notice">Harassment / Atmosphere cases may describe traveler risk even when the venue owner was not the actor.</div>
    <div class="modal-proof"><strong>Sources / evidence</strong><ul class="source-list">${sources}</ul></div>
    <div style="margin-top:16px;"><button class="btn btn-primary" onclick="openCommentModal('${item.id}')">Add experience comment</button></div>`;
  document.getElementById("modalBackdrop").style.display = "flex";
}

function openCommentModal(id) {
  const item = currentPublicIncidents.find(i => String(i.id) === String(id));
  if (!item) return;
  document.getElementById("modalContent").innerHTML = `
    <h2>Comment on ${safeHtml(item.name)}</h2>
    <p>Tell the moderation team if you had the same experience, a different experience, or useful context. Comments are reviewed before publication.</p>
    <form onsubmit="submitComment(event,'${item.id}')">
      <div class="form-grid">
        <div class="input-box"><label>Your name</label><input name="author_name" required /></div>
        <div class="input-box"><label>Experience type</label><select name="experience_type" required><option value="confirmed_issue">I had a similar issue</option><option value="opposite_experience">I went there and it went well</option><option value="contextual_feedback">Context / correction</option></select></div>
        <div class="input-box full"><label>Email optional</label><input type="email" name="email" /></div>
        <div class="input-box full"><label>Comment</label><textarea name="comment" required></textarea></div>
        <button class="btn btn-primary full" type="submit">Submit comment for moderation</button><p id="commentStatus" class="full" style="font-weight:900;"></p>
      </div>
    </form>`;
  document.getElementById("modalBackdrop").style.display = "flex";
}

async function submitComment(event, incidentId) {
  event.preventDefault();
  const status = document.getElementById("commentStatus");
  status.textContent = "Submitting...";
  try {
    const form = new FormData(event.target);
    const { error } = await antibookingSupabase.from("comments").insert({
      incident_id: incidentId,
      author_name: form.get("author_name"),
      email: form.get("email") || null,
      experience_type: form.get("experience_type"),
      comment: form.get("comment"),
      status: "pending"
    });
    if (error) throw error;
    status.textContent = "Thanks. Your comment is pending moderation.";
    status.style.color = "#15803d";
    event.target.reset();
  } catch (error) {
    status.textContent = "Comment table not ready: run pages/setup-comments-v2-4.sql.";
    status.style.color = "#dc2626";
  }
}

function getCategoryImage(category) {
  if (category === "Hotel") return "/assets/img/categories/hotel.svg";
  if (category === "Restaurant") return "/assets/img/categories/restaurant.svg";
  if (category === "Taxi / Transport") return "/assets/img/categories/transport.svg";
  if (category === "Museum / Attraction") return "/assets/img/categories/museum.svg";
  if (category === "Airbnb / Rental") return "/assets/img/categories/airbnb.svg";
  if (category === "Airport Service") return "/assets/img/categories/airport.svg";
  if (category === "Harassment / Atmosphere") return "/assets/img/categories/atmosphere.svg";
  return "/assets/img/categories/atmosphere.svg";
}

function closeModal() { document.getElementById("modalBackdrop").style.display = "none"; }
function resetFilters() { countrySelect.value = "all"; updateCities(); categorySelect.value = "all"; filterIncidents(); }

function riskScore(item) {
  const c = String(item.confidence || "").toLowerCase();
  if (c.includes("high") || c.includes("embassy") || c.includes("official") || c.includes("verified")) return 5;
  if (c.includes("video") || c.includes("media") || c.includes("report")) return 4;
  if (c.includes("medium")) return 3;
  if (c.includes("verification")) return 2;
  return 2;
}
function riskBars(score) { return `<div class="risk-bars">${[1,2,3,4,5].map(n => `<span class="${score >= n ? (score >= 4 ? "on high" : score >= 3 ? "on mid" : "on low") : ""}"></span>`).join("")}</div>`; }
function trustLabel(confidence) {
  const c = String(confidence || "").toLowerCase();
  if (c.includes("embassy") || c.includes("official")) return "Official / embassy";
  if (c.includes("video")) return "Video evidence";
  if (c.includes("verified")) return "Verified media";
  if (c.includes("media") || c.includes("report")) return "Media report";
  if (c.includes("verification")) return "Needs verification";
  return "Approved report";
}
function trustClass(confidence) {
  const c = String(confidence || "").toLowerCase();
  if (c.includes("embassy") || c.includes("official") || c.includes("verified") || c.includes("media")) return "tag-green";
  if (c.includes("verification") || c.includes("medium")) return "tag-gold";
  return "tag-red";
}
function formatDate(dateString) {
  if (!dateString) return "Date unknown";
  const date = new Date(dateString + "T00:00:00");
  return Number.isNaN(date.getTime()) ? dateString : date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}
function safeHtml(value) { return String(value || "").replace(/[<>&"]/g, c => ({ "<":"&lt;", ">":"&gt;", "&":"&amp;", '"':"&quot;" }[c])); }
function safeAttr(value) { return safeHtml(value).replace(/'/g, "&#39;"); }

document.addEventListener("DOMContentLoaded", () => {
  initFilters();
  const backdrop = document.getElementById("modalBackdrop");
  if (backdrop) backdrop.addEventListener("click", event => { if (event.target.id === "modalBackdrop") closeModal(); });
});
