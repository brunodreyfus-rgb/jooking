/* Risk Map page.
   Uses the same shared country coordinates/scoring as the Home map.
*/

function renderRiskSummary(rows, countries) {
  const helpers = window.JookingRiskMap;
  const element = document.getElementById("riskSummary");
  if (!element) return;

  element.innerHTML = `
    <div class="risk-summary-grid">
      <div class="risk-kpi"><strong>${rows.length}</strong><span>Approved reports</span></div>
      <div class="risk-kpi"><strong>${countries.length}</strong><span>Countries</span></div>
      <div class="risk-kpi"><strong>${countries.filter(country => helpers.riskLevel(country.score) === "high").length}</strong><span>High-risk countries</span></div>
    </div>
  `;
}

function renderRiskMap(countries) {
  const map = document.getElementById("riskWorldMap");
  if (!map || !window.JookingRiskMap) return;
  window.JookingRiskMap.renderPins(map, countries, { type: "risk" });
}

function renderCountryCards(countries) {
  const helpers = window.JookingRiskMap;
  const grid = document.getElementById("countryGrid");
  const count = document.getElementById("countryCount");
  if (!grid) return;

  if (count) count.textContent = `${countries.length} countries with approved Supabase reports.`;

  if (!countries.length) {
    grid.innerHTML = `
      <div class="country-card">
        <h3>No approved reports</h3>
        <p>No approved incidents found in Supabase.</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = countries.map(item => {
    const level = helpers.riskLevel(item.score);
    const categories = Object.entries(item.categories || {})
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([category, total]) => `${category} (${total})`)
      .join(", ");

    return `
      <article class="country-card" id="country-${helpers.slug(item.country)}">
        <span class="risk-pill ${level}">${level.toUpperCase()}</span>
        <h3>${helpers.esc(item.country)}</h3>
        <p>${item.count} approved report${item.count === 1 ? "" : "s"}</p>
        <p>Risk score: ${item.score}</p>
        <p>Top categories: ${helpers.esc(categories || "N/A")}</p>
        <p>Latest: ${item.latest ? helpers.formatDate(item.latest) : "N/A"}</p>
      </article>
    `;
  }).join("");
}

document.addEventListener("DOMContentLoaded", async () => {
  try {
    if (!window.JookingRiskMap) throw new Error("risk-map-shared.js missing");

    const rows = await window.JookingRiskMap.loadRiskRows();
    const countries = window.JookingRiskMap.groupCountries(rows);

    renderRiskSummary(rows, countries);
    renderRiskMap(countries);
    renderCountryCards(countries);

    if (window.location.hash) {
      setTimeout(() => {
        document.querySelector(window.location.hash)
          ?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 500);
    }
  } catch (error) {
    console.error("Risk map failed", error);
    const element = document.getElementById("riskSummary");
    if (element) element.textContent = "Could not load risk dashboard. Check Supabase connection.";
  }
});
