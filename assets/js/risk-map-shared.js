/* Jooking shared risk-map logic - static HTML version
   One source of truth for Home + Risk Map.
   Coordinates are real lon/lat projected onto the equirectangular world map image.
*/

window.JOOKING_FORCE_HIGH_COUNTRIES = ["United States", "Japan", "Italy"];

window.JOOKING_COUNTRY_ALIASES = {
  "us": "United States", "usa": "United States", "u.s.": "United States", "u.s.a.": "United States",
  "united states of america": "United States", "america": "United States",
  "uk": "United Kingdom", "u.k.": "United Kingdom", "great britain": "United Kingdom", "england": "United Kingdom",
  "it": "Italy", "italia": "Italy", "jp": "Japan", "japon": "Japan",
  "de": "Germany", "fr": "France", "es": "Spain", "spain / argentina": "Argentina / Spain", "argentina/spain": "Argentina / Spain"
};

window.JOOKING_COUNTRY_LONLAT = {
  "United States": [-98, 39], "Canada": [-106, 57], "Mexico": [-102, 23], "Colombia": [-74, 4], "Brazil": [-52, -10],
  "Argentina": [-64, -34], "Chile": [-71, -30], "Argentina / Spain": [-20, 12],
  "United Kingdom": [-2, 54], "Ireland": [-8, 53], "Portugal": [-8, 39], "Spain": [-4, 40], "France": [2, 46],
  "Belgium": [4, 51], "Netherlands": [5, 52], "Germany": [10, 51], "Switzerland": [8, 47], "Austria": [14, 47],
  "Italy": [12.5, 42.5], "Norway": [8, 62], "Sweden": [15, 62], "Finland": [26, 64], "Denmark": [10, 56],
  "Poland": [19, 52], "Czech Republic": [15, 49.8], "Hungary": [19, 47], "Romania": [25, 46], "Bulgaria": [25, 43],
  "Croatia": [16, 45], "Serbia": [21, 44], "Bosnia": [18, 44], "Bosnia and Herzegovina": [18, 44], "Greece": [22, 39],
  "Cyprus": [33, 35], "Turkey": [35, 39], "Israel": [35, 31.5], "United Arab Emirates": [54, 24], "Egypt": [30, 27],
  "Morocco": [-7, 32], "Tunisia": [10, 34], "South Africa": [24, -29], "Middle East": [43, 29], "Kyrgyzstan": [75, 41],
  "Maldives": [73, 4], "Thailand": [101, 15], "Vietnam": [108, 16], "Japan": [138, 37], "Australia": [134, -25],
  "Southeast Asia": [108, 12]
};

function jookingProjectLonLat(lon, lat) {
  return [((Number(lon) + 180) / 360) * 100, ((90 - Number(lat)) / 180) * 100];
}

window.JOOKING_COUNTRY_COORDINATES = Object.fromEntries(
  Object.entries(window.JOOKING_COUNTRY_LONLAT).map(([country, ll]) => [country, jookingProjectLonLat(ll[0], ll[1])])
);

window.JOOKING_REGION_FALLBACKS = [
  { country: "United States", count: 0, score: 12 }, { country: "Italy", count: 0, score: 12 }, { country: "Japan", count: 0, score: 12 },
  { country: "United Kingdom", count: 0, score: 5 }, { country: "France", count: 0, score: 5 }, { country: "Spain", count: 0, score: 5 },
  { country: "Middle East", count: 0, score: 12 }, { country: "Southeast Asia", count: 0, score: 5 }, { country: "Australia", count: 0, score: 2 }
];

function jookingNormalizeCountry(country) {
  const raw = String(country || "").trim();
  const key = raw.toLowerCase();
  return window.JOOKING_COUNTRY_ALIASES[key] || raw;
}

function jookingRiskClient() {
  if (window.antibookingSupabase) return window.antibookingSupabase;
  if (window.supabaseClient) return window.supabaseClient;
  try { if (typeof antibookingSupabase !== "undefined") return antibookingSupabase; } catch (e) {}
  return null;
}

async function jookingLoadRiskRows() {
  const client = jookingRiskClient();
  if (!client) throw new Error("Supabase client missing");
  const { data, error } = await client.from("incidents").select("id,country,city,category,status,tourism_type,incident_date,created_at").eq("status", "approved");
  if (error) throw error;
  return Array.isArray(data) ? data : [];
}

function jookingGroupCountries(rows) {
  const grouped = {};
  rows.forEach(row => {
    const country = jookingNormalizeCountry(row.country || "Unknown");
    if (!grouped[country]) grouped[country] = { country, count: 0, direct: 0, related: 0, categories: {}, latest: null };
    grouped[country].count += 1;
    if (String(row.tourism_type || "").toLowerCase().includes("related")) grouped[country].related += 1; else grouped[country].direct += 1;
    const category = row.category || "Other";
    grouped[country].categories[category] = (grouped[country].categories[category] || 0) + 1;
    const date = row.incident_date || row.created_at;
    if (date && (!grouped[country].latest || new Date(date) > new Date(grouped[country].latest))) grouped[country].latest = date;
  });
  return Object.values(grouped).map(country => {
    const forcedHigh = window.JOOKING_FORCE_HIGH_COUNTRIES.includes(country.country);
    return { ...country, score: forcedHigh ? Math.max(country.direct * 4 + country.related * 2, 12) : country.direct * 4 + country.related * 2 };
  }).sort((a, b) => b.score - a.score);
}

function jookingRiskLevel(score) { if (score >= 12) return "high"; if (score >= 5) return "medium"; return "low"; }
function jookingSlug(value) { return String(value || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); }
function jookingEsc(value) { return String(value || "").replace(/[<>&"]/g, char => ({"<":"&lt;",">":"&gt;","&":"&amp;",'"':"&quot;"}[char])); }
function jookingFormatDate(value) { const date = new Date(value); return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }); }
function jookingGetCoordinates(country) { const normalized = jookingNormalizeCountry(country); return window.JOOKING_COUNTRY_COORDINATES[normalized] || null; }
function jookingClearPins(container) { container.querySelectorAll(".map-pin,.country-pin,.jooking-risk-pin,.jooking-dynamic-map-pin,.legacy-map-pin,.map-marker").forEach(pin => pin.remove()); }

function jookingRenderPins(container, countries, options = {}) {
  if (!container) return;
  const type = options.type || "home";
  jookingClearPins(container);
  const items = (countries.length ? countries : window.JOOKING_REGION_FALLBACKS).map(item => {
    const country = jookingNormalizeCountry(item.country);
    return { ...item, country, coords: item.coords || jookingGetCoordinates(country) };
  }).filter(item => item.coords);
  items.forEach(item => {
    const level = jookingRiskLevel(item.score || item.count || 0);
    const pin = document.createElement("button");
    pin.type = "button";
    pin.className = type === "risk" ? `country-pin ${level} jooking-risk-pin` : `jooking-dynamic-map-pin ${level} jooking-risk-pin`;
    pin.style.left = `${item.coords[0]}%`;
    pin.style.top = `${item.coords[1]}%`;
    pin.title = `${item.country}${item.count ? `: ${item.count} approved reports` : ""}`;
    pin.setAttribute("aria-label", pin.title);
    pin.addEventListener("click", () => {
      if (type === "risk") document.getElementById(`country-${jookingSlug(item.country)}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
      else window.location.href = `/pages/country-risk.html#country-${jookingSlug(item.country)}`;
    });
    container.appendChild(pin);
  });
}

window.JookingRiskMap = { normalizeCountry: jookingNormalizeCountry, loadRiskRows: jookingLoadRiskRows, groupCountries: jookingGroupCountries, riskLevel: jookingRiskLevel, slug: jookingSlug, esc: jookingEsc, formatDate: jookingFormatDate, renderPins: jookingRenderPins, getCoordinates: jookingGetCoordinates };
