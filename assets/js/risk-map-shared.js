/* Jooking shared risk-map logic
   One source of truth for Home + Risk Map.
   Fixes:
   - same coordinates on both pages
   - USA/Japan/Italy forced as High/red
   - aliases such as US/USA/United States of America/IT/JP
*/

window.JOOKING_FORCE_HIGH_COUNTRIES = ["United States", "Japan", "Italy"];

window.JOOKING_COUNTRY_ALIASES = {
  "us": "United States",
  "usa": "United States",
  "u.s.": "United States",
  "u.s.a.": "United States",
  "united states of america": "United States",
  "america": "United States",

  "uk": "United Kingdom",
  "u.k.": "United Kingdom",
  "great britain": "United Kingdom",
  "england": "United Kingdom",

  "it": "Italy",
  "italia": "Italy",

  "jp": "Japan",
  "japon": "Japan",

  "de": "Germany",
  "fr": "France",
  "es": "Spain",
  "spain / argentina": "Argentina / Spain",
  "argentina/spain": "Argentina / Spain"
};

window.JOOKING_COUNTRY_COORDINATES = {
  "United States": [21, 39],
  "Canada": [18, 31],
  "Mexico": [27, 47],
  "Colombia": [29, 59],
  "Argentina": [34, 77],
  "Argentina / Spain": [43, 54],

  "United Kingdom": [47, 32],
  "France": [48, 38],
  "Spain": [46, 42],
  "Germany": [51, 35],
  "Austria": [52, 37],
  "Italy": [51, 43],
  "Greece": [54, 45],
  "Norway": [50, 25],
  "Finland": [54, 23],

  "Israel": [59, 45],
  "Middle East": [60, 44],
  "Kyrgyzstan": [67, 41],

  "Thailand": [75, 57],
  "Vietnam": [77, 57],
  "Japan": [86, 42],
  "Australia": [86, 82]
};

window.JOOKING_REGION_FALLBACKS = [
  { country: "United States", count: 0, score: 12, coords: [21, 39] },
  { country: "Italy", count: 0, score: 12, coords: [51, 43] },
  { country: "Japan", count: 0, score: 12, coords: [86, 42] },
  { country: "United Kingdom", count: 0, score: 5, coords: [47, 32] },
  { country: "France", count: 0, score: 5, coords: [48, 38] },
  { country: "Spain", count: 0, score: 5, coords: [46, 42] },
  { country: "Middle East", count: 0, score: 12, coords: [60, 44] },
  { country: "Southeast Asia", count: 0, score: 5, coords: [76, 57] },
  { country: "Australia", count: 0, score: 2, coords: [86, 82] }
];

function jookingNormalizeCountry(country) {
  const raw = String(country || "").trim();
  const key = raw.toLowerCase();
  return window.JOOKING_COUNTRY_ALIASES[key] || raw;
}

function jookingRiskClient() {
  if (window.antibookingSupabase) return window.antibookingSupabase;
  if (window.supabaseClient) return window.supabaseClient;
  try {
    if (typeof antibookingSupabase !== "undefined") return antibookingSupabase;
  } catch (e) {}
  return null;
}

async function jookingLoadRiskRows() {
  const client = jookingRiskClient();
  if (!client) throw new Error("Supabase client missing");

  const { data, error } = await client
    .from("incidents")
    .select("id,country,city,category,status,tourism_type,incident_date,created_at")
    .eq("status", "approved");

  if (error) throw error;
  return Array.isArray(data) ? data : [];
}

function jookingGroupCountries(rows) {
  const grouped = {};

  rows.forEach(row => {
    const country = jookingNormalizeCountry(row.country || "Unknown");

    if (!grouped[country]) {
      grouped[country] = {
        country,
        count: 0,
        direct: 0,
        related: 0,
        categories: {},
        latest: null
      };
    }

    grouped[country].count += 1;

    if (String(row.tourism_type || "").toLowerCase().includes("related")) {
      grouped[country].related += 1;
    } else {
      grouped[country].direct += 1;
    }

    const category = row.category || "Other";
    grouped[country].categories[category] = (grouped[country].categories[category] || 0) + 1;

    const date = row.incident_date || row.created_at;
    if (date && (!grouped[country].latest || new Date(date) > new Date(grouped[country].latest))) {
      grouped[country].latest = date;
    }
  });

  return Object.values(grouped)
    .map(country => {
      const forcedHigh = window.JOOKING_FORCE_HIGH_COUNTRIES.includes(country.country);
      return {
        ...country,
        score: forcedHigh ? Math.max(country.direct * 4 + country.related * 2, 12) : country.direct * 4 + country.related * 2
      };
    })
    .sort((a, b) => b.score - a.score);
}

function jookingRiskLevel(score) {
  if (score >= 12) return "high";
  if (score >= 5) return "medium";
  return "low";
}

function jookingSlug(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function jookingEsc(value) {
  return String(value || "").replace(/[<>&"]/g, char => ({
    "<": "&lt;",
    ">": "&gt;",
    "&": "&amp;",
    '"': "&quot;"
  }[char]));
}

function jookingFormatDate(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

function jookingGetCoordinates(country) {
  const normalized = jookingNormalizeCountry(country);
  return window.JOOKING_COUNTRY_COORDINATES[normalized] || null;
}

function jookingClearPins(container) {
  container
    .querySelectorAll(".map-pin,.country-pin,.jooking-risk-pin")
    .forEach(pin => pin.remove());
}

function jookingRenderPins(container, countries, options = {}) {
  if (!container) return;

  const type = options.type || "home";
  jookingClearPins(container);

  const items = countries.length
    ? countries.map(item => {
        const country = jookingNormalizeCountry(item.country);
        return {
          ...item,
          country,
          coords: jookingGetCoordinates(country)
        };
      }).filter(item => item.coords)
    : window.JOOKING_REGION_FALLBACKS;

  items.forEach(item => {
    const coords = item.coords || jookingGetCoordinates(item.country);
    if (!coords) return;

    const level = jookingRiskLevel(item.score || 0);
    const pin = document.createElement("button");

    pin.className = type === "risk"
      ? `country-pin ${level} jooking-risk-pin`
      : `map-pin ${level} jooking-risk-pin`;

    pin.style.left = `${coords[0]}%`;
    pin.style.top = `${coords[1]}%`;
    pin.title = `${item.country}${item.count ? `: ${item.count} approved reports` : ""}`;

    pin.addEventListener("click", () => {
      if (type === "risk") {
        document.getElementById(`country-${jookingSlug(item.country)}`)
          ?.scrollIntoView({ behavior: "smooth", block: "center" });
      } else {
        window.location.href = `/pages/country-risk.html#country-${jookingSlug(item.country)}`;
      }
    });

    container.appendChild(pin);
  });
}

window.JookingRiskMap = {
  normalizeCountry: jookingNormalizeCountry,
  loadRiskRows: jookingLoadRiskRows,
  groupCountries: jookingGroupCountries,
  riskLevel: jookingRiskLevel,
  slug: jookingSlug,
  esc: jookingEsc,
  formatDate: jookingFormatDate,
  renderPins: jookingRenderPins
};
