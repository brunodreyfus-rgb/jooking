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

  countrySelect.addEventListener("change", updateCities);
  categorySelect.addEventListener("change", filterIncidents);

  updateCities();
  renderCategoryTiles();
  renderResults(currentPublicIncidents);
}

function updateCities() {
  const selectedCountry = countrySelect.value;
  const cities = [...new Set(
    currentPublicIncidents
      .filter(item => selectedCountry === "all" || item.country === selectedCountry)
      .map(item => item.city)
  )].sort();

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

  const filtered = currentPublicIncidents.filter(item => {
    return (country === "all" || item.country === country)
      && (city === "all" || item.city === city)
      && (category === "all" || item.category === category);
  });

  renderResults(filtered);
}

function renderResults(items) {
  resultsGrid.innerHTML = "";

  if (items.length === 0) {
    emptyState.style.display = "block";
    resultCount.textContent = "No approved incidents found yet.";
    return;
  }

  emptyState.style.display = "none";
  resultCount.textContent = `Showing ${items.length} approved / real-source result${items.length > 1 ? "s" : ""}.`;

  items.forEach(item => {
    const card = document.createElement("article");
    card.className = "incident-card";
    card.innerHTML = `
      <div class="card-image"><img src="${categoryImage(item.category)}" alt="${safeHtml(item.category)}" /></div>
      <div class="card-body">
        <div class="tag-row">
          <span class="tag">${safeHtml(item.category)}</span>
          <span class="tag tag-red">${safeHtml(item.confidence)}</span>
          <span class="tag tag-green">Approved / real source</span>
        </div>
        <h3>${safeHtml(item.name)}</h3>
        <p>${safeHtml(item.summary)}</p>
        <button class="btn btn-primary" onclick="openIncident('${item.id}')" style="width:100%;">View incident</button>
        <div class="meta">
          <span>${safeHtml(item.city)}, ${safeHtml(item.country)}</span>
          <span>${formatDate(item.date)}</span>
        </div>
      </div>
    `;
    resultsGrid.appendChild(card);
  });
}

function renderCategoryTiles() {
  const categoryStrip = document.getElementById("categoryStrip");
  if (!categoryStrip) return;

  const cats = [
    ["Hotel", "Hotels"],
    ["Restaurant", "Restaurants"],
    ["Taxi / Transport", "Taxi / Transport"],
    ["Museum / Attraction", "Attractions"],
    ["Airbnb / Rental", "Airbnb / Rentals"],
    ["Airport Service", "Airport Services"]
  ];

  categoryStrip.innerHTML = cats.map(([value, label]) => `
    <button class="category-tile" onclick="selectCategory('${value.replace(/'/g, "\\'")}')">
      <img src="${categoryImage(value)}" alt="${safeHtml(label)}" />
      <strong>${safeHtml(label)}</strong>
    </button>
  `).join("");
}

function selectCategory(category) {
  categorySelect.value = category;
  filterIncidents();
  document.getElementById("search").scrollIntoView({ behavior: "smooth" });
}

function openIncident(id) {
  const item = currentPublicIncidents.find(incident => String(incident.id) === String(id));
  if (!item) return;

  const sources = (item.sources || []).map(source => {
    if (!source.url || source.url === "#") return `<li>${safeHtml(source.label)}</li>`;
    return `<li><a href="${safeAttr(source.url)}" target="_blank" rel="noopener noreferrer">${safeHtml(source.label)}</a></li>`;
  }).join("");

  document.getElementById("modalContent").innerHTML = `
    <div class="tag-row">
      <span class="tag">${safeHtml(item.category)}</span>
      <span class="tag tag-red">${safeHtml(item.confidence)}</span>
      <span class="tag tag-green">Approved / real source</span>
    </div>
    <h2>${safeHtml(item.name)}</h2>
    <p><strong>Location:</strong> ${safeHtml(item.city)}, ${safeHtml(item.country)}</p>
    <p><strong>Incident date:</strong> ${formatDate(item.date)}</p>
    <p>${safeHtml(item.details)}</p>
    <div class="notice" style="margin-top:18px;">This report is displayed as an approved or real-source AntiBooking lead. Keep wording factual and review legal status when updating.</div>
    <div class="modal-proof">
      <strong>Sources / evidence</strong>
      <ul class="source-list">${sources}</ul>
    </div>
  `;

  document.getElementById("modalBackdrop").style.display = "flex";
}

function closeModal() {
  document.getElementById("modalBackdrop").style.display = "none";
}

function resetFilters() {
  countrySelect.value = "all";
  updateCities();
  categorySelect.value = "all";
  filterIncidents();
}

function formatDate(dateString) {
  if (!dateString) return "Date unknown";
  const date = new Date(dateString + "T00:00:00");
  if (Number.isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

function safeHtml(value) {
  return String(value || "").replace(/[<>&"]/g, function(char) {
    return { "<": "&lt;", ">": "&gt;", "&": "&amp;", "\"": "&quot;" }[char];
  });
}

function safeAttr(value) {
  return safeHtml(value).replace(/'/g, "&#39;");
}

document.addEventListener("DOMContentLoaded", () => {
  initFilters();
  const backdrop = document.getElementById("modalBackdrop");
  if (backdrop) {
    backdrop.addEventListener("click", function(event) {
      if (event.target.id === "modalBackdrop") closeModal();
    });
  }
});
