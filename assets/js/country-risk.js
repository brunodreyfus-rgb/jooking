/* AntiBooking V2.5.10 - Supabase-only Risk Map */

const countryCoordinates = {
  "Argentina / Spain": [43, 54],
  "Australia": [82, 82],
  "Austria": [51, 35],
  "Colombia": [29, 56],
  "Finland": [53, 23],
  "France": [48, 37],
  "Germany": [51, 34],
  "Greece": [53, 42],
  "Italy": [50, 42],
  "Japan": [84, 43],
  "Kyrgyzstan": [67, 41],
  "Norway": [50, 25],
  "Spain": [47, 40],
  "Thailand": [74, 56],
  "United Kingdom": [47, 33],
  "United States": [22, 43],
  "Vietnam": [76, 56]
};

function getRiskClient() {
  if (window.antibookingSupabase) return window.antibookingSupabase;
  if (window.supabaseClient) return window.supabaseClient;
  try { if (typeof antibookingSupabase !== "undefined") return antibookingSupabase; } catch(e) {}
  return null;
}

async function loadApprovedIncidentsForMap() {
  const client = getRiskClient();
  if (!client) throw new Error("Supabase client not found");

  const { data, error } = await client
    .from("incidents")
    .select("id,country,city,category,status,tourism_type,incident_date,created_at")
    .eq("status", "approved");

  if (error) throw error;
  return Array.isArray(data) ? data : [];
}

function groupMapCountries(rows) {
  const grouped = {};
  rows.forEach(row => {
    const country = row.country || "Unknown";
    if (!grouped[country]) {
      grouped[country] = { country, count: 0, categories: {}, direct: 0, related: 0, latest: null };
    }

    grouped[country].count += 1;
    const cat = row.category || "Other";
    grouped[country].categories[cat] = (grouped[country].categories[cat] || 0) + 1;

    if (String(row.tourism_type || "").includes("related")) grouped[country].related += 1;
    else grouped[country].direct += 1;

    const date = row.incident_date || row.created_at;
    if (date && (!grouped[country].latest || new Date(date) > new Date(grouped[country].latest))) {
      grouped[country].latest = date;
    }
  });

  return Object.values(grouped)
    .map(c => ({ ...c, score: c.direct * 4 + c.related * 2 }))
    .sort((a, b) => b.score - a.score);
}

function riskLevel(score) {
  if (score >= 12) return "high";
  if (score >= 5) return "medium";
  return "low";
}

function renderRiskSummary(rows, countries) {
  const el = document.getElementById("riskSummary");
  if (!el) return;

  el.innerHTML = `
    <div class="risk-summary-grid">
      <div class="risk-kpi"><strong>${rows.length}</strong><span>Approved reports</span></div>
      <div class="risk-kpi"><strong>${countries.length}</strong><span>Countries</span></div>
      <div class="risk-kpi"><strong>${countries.filter(c => riskLevel(c.score) === "high").length}</strong><span>High-risk countries</span></div>
    </div>
  `;
}

function renderRiskMap(countries) {
  const map = document.getElementById("riskWorldMap");
  if (!map) return;

  map.querySelectorAll(".country-pin").forEach(pin => pin.remove());

  countries.forEach(item => {
    const coords = countryCoordinates[item.country];
    if (!coords) return;

    const pin = document.createElement("button");
    pin.className = `country-pin ${riskLevel(item.score)}`;
    pin.style.left = `${coords[0]}%`;
    pin.style.top = `${coords[1]}%`;
    pin.title = `${item.country}: ${item.count} reports, score ${item.score}`;
    pin.onclick = () => {
      document.getElementById(`country-${slug(item.country)}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
    };
    map.appendChild(pin);
  });
}

function renderRiskCountries(countries) {
  const grid = document.getElementById("countryGrid");
  const count = document.getElementById("countryCount");
  if (!grid) return;

  if (count) count.textContent = `${countries.length} countries with approved Supabase reports.`;

  if (countries.length === 0) {
    grid.innerHTML = `<div class="country-card"><h3>No approved reports</h3><p>No approved incidents found in Supabase.</p></div>`;
    return;
  }

  grid.innerHTML = countries.map(item => {
    const level = riskLevel(item.score);
    const categories = Object.entries(item.categories)
      .sort((a,b) => b[1] - a[1])
      .slice(0,3)
      .map(([cat,n]) => `${cat} (${n})`)
      .join(", ");

    return `
      <article class="country-card" id="country-${slug(item.country)}">
        <span class="risk-pill ${level}">${level.toUpperCase()}</span>
        <h3>${escapeHtml(item.country)}</h3>
        <p>${item.count} approved report${item.count > 1 ? "s" : ""}</p>
        <p>Risk score: ${item.score}</p>
        <p>Top categories: ${escapeHtml(categories || "N/A")}</p>
        <p>Latest: ${item.latest ? formatDate(item.latest) : "N/A"}</p>
      </article>
    `;
  }).join("");
}

function slug(value) {
  return String(value || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function escapeHtml(value) {
  return String(value || "").replace(/[<>&"]/g, c => ({ "<":"&lt;", ">":"&gt;", "&":"&amp;", '"':"&quot;" }[c]));
}

function formatDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-US", { year:"numeric", month:"short", day:"numeric" });
}

async function initRiskDashboard() {
  try {
    const rows = await loadApprovedIncidentsForMap();
    const countries = groupMapCountries(rows);
    renderRiskSummary(rows, countries);
    renderRiskMap(countries);
    renderRiskCountries(countries);
    console.info(`AntiBooking Risk Map loaded ${rows.length} approved reports from Supabase.`);
  } catch (error) {
    console.error("AntiBooking Risk Map failed:", error);
    const summary = document.getElementById("riskSummary");
    if (summary) summary.textContent = "Could not load risk dashboard. Check Supabase policies and script order.";
  }
}

document.addEventListener("DOMContentLoaded", initRiskDashboard);
