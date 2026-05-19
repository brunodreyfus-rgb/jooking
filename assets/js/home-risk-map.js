/* Jooking V2.5.28 - dynamic country map pins + corrected positions
   - reads approved incidents from Supabase
   - creates one pin per country with known coordinates
   - red/orange/blue levels based on report count
   - hover tooltip: Country - X reports
   - click pin: selects country in search filters, runs search, scrolls to results
   - fixed US/Canada/Australia positions and prevents pins escaping map
*/

(function () {
  const COUNTRY_COORDS = {
    "Argentina": [30, 72],
    "Argentina / Spain": [43, 54],
    "Australia": [78, 56],
    "Austria": [50.5, 36],
    "Belgium": [48.5, 34],
    "Bosnia": [51.5, 39],
    "Bosnia and Herzegovina": [51.5, 39],
    "Brazil": [33, 68],
    "Bulgaria": [53, 40],
    "Canada": [21, 20],
    "Chile": [29, 78],
    "Colombia": [29, 58],
    "Croatia": [50.5, 38],
    "Cyprus": [56, 43],
    "Czech Republic": [51, 35],
    "Denmark": [50, 30],
    "Egypt": [55, 47],
    "Finland": [54, 23],
    "France": [48, 37],
    "Germany": [50, 34],
    "Greece": [54, 43],
    "Hungary": [52, 37],
    "Israel": [57.5, 45],
    "Italy": [50.5, 42],
    "Japan": [84, 43],
    "Kyrgyzstan": [67, 41],
    "Maldives": [67, 63],
    "Mexico": [20, 49],
    "Morocco": [47, 48],
    "Netherlands": [49, 33],
    "Norway": [50, 24],
    "Poland": [52, 34],
    "Portugal": [46, 41],
    "Romania": [53.5, 38],
    "Serbia": [52, 39],
    "South Africa": [53, 82],
    "Spain": [47, 41],
    "Sweden": [51.5, 25],
    "Switzerland": [49.5, 37],
    "Thailand": [74, 57],
    "Tunisia": [50, 46],
    "Turkey": [56, 41],
    "United Arab Emirates": [62, 49],
    "United Kingdom": [47, 33],
    "United States": [19, 33],
    "USA": [19, 33],
    "Vietnam": [76, 56]
  };

  function clampPosition(left, top) {
    const SAFE_LEFT = 5;
    const SAFE_RIGHT = 82;
    const SAFE_TOP = 8;
    const SAFE_BOTTOM = 82;

    return {
      left: Math.max(SAFE_LEFT, Math.min(left, SAFE_RIGHT)),
      top: Math.max(SAFE_TOP, Math.min(top, SAFE_BOTTOM))
    };
  }

  function normalize(value) {
    return String(value || "").trim();
  }

  function canonicalCountry(value) {
    const v = normalize(value);
    if (!v) return "";
    if (["US", "U.S.", "U.S.A.", "USA", "United States of America"].includes(v)) return "United States";
    if (v === "UK") return "United Kingdom";
    if (v === "Bosnia & Herzegovina") return "Bosnia and Herzegovina";
    return v;
  }

  function getClient() {
    if (window.antibookingSupabase) return window.antibookingSupabase;
    if (window.supabaseClient) return window.supabaseClient;
    try { if (typeof antibookingSupabase !== "undefined") return antibookingSupabase; } catch(e) {}
    return null;
  }

  function level(count) {
    if (count >= 5) return "high";
    if (count >= 2) return "medium";
    return "low";
  }

  async function loadRows() {
    const client = getClient();
    if (!client) return [];

    const { data, error } = await client
      .from("incidents")
      .select("id,country,status,city,category,place_name")
      .eq("status", "approved");

    if (error) {
      console.error("Jooking map: could not load incidents", error);
      return [];
    }

    return Array.isArray(data) ? data : [];
  }

  function groupByCountry(rows) {
    const grouped = {};

    rows.forEach(row => {
      const country = canonicalCountry(row.country);
      if (!country) return;

      if (!grouped[country]) {
        grouped[country] = {
          country,
          count: 0,
          cities: new Set(),
          categories: new Set()
        };
      }

      grouped[country].count += 1;
      if (row.city) grouped[country].cities.add(row.city);
      if (row.category) grouped[country].categories.add(row.category);
    });

    return Object.values(grouped)
      .map(item => ({
        ...item,
        cities: Array.from(item.cities),
        categories: Array.from(item.categories)
      }))
      .sort((a, b) => b.count - a.count || a.country.localeCompare(b.country));
  }

  function removeExistingPins(map) {
    map.querySelectorAll(".map-pin, .jooking-dynamic-map-pin, .jooking-map-tooltip").forEach(el => el.remove());
  }

  function getCountrySelectValue(country) {
    const select = document.getElementById("countrySelect");
    if (!select) return null;

    const match = Array.from(select.options).find(option => {
      const value = canonicalCountry(option.value);
      const label = canonicalCountry(option.textContent);
      return value === country || label === country;
    });

    return match ? match.value : null;
  }

  function runSearch(country) {
    const countrySelect = document.getElementById("countrySelect");
    const citySelect = document.getElementById("citySelect");
    const categorySelect = document.getElementById("categorySelect");
    const selectValue = getCountrySelectValue(country);

    if (!countrySelect || !selectValue) return;

    countrySelect.value = selectValue;
    countrySelect.dispatchEvent(new Event("change", { bubbles: true }));

    if (citySelect) {
      citySelect.value = "all";
      citySelect.dispatchEvent(new Event("change", { bubbles: true }));
    }

    if (categorySelect) {
      categorySelect.value = "all";
      categorySelect.dispatchEvent(new Event("change", { bubbles: true }));
    }

    if (typeof window.filterIncidents === "function") {
      window.filterIncidents();
    } else {
      document.querySelector(".search-grid .btn")?.click();
    }

    setTimeout(() => {
      const first =
        document.querySelector("#resultsGrid > article") ||
        document.querySelector("#resultsGrid > div:not(.empty-state)") ||
        document.getElementById("resultsGrid");

      first?.scrollIntoView({ behavior: "smooth", block: "start" });
      first?.classList.add("jooking-report-highlight");
      setTimeout(() => first?.classList.remove("jooking-report-highlight"), 1800);

      const hint = document.querySelector(".search-title .search-result-hint");
      const countText = document.getElementById("resultCount")?.textContent || "";
      const n = (countText.match(/\d+/) || [""])[0];
      if (hint) hint.textContent = n ? `${n} reported place${n === "1" ? "" : "s"} below for ${country}` : `Reported places below for ${country}`;
    }, 250);

    if (typeof window.jookingTrack === "function") {
      window.jookingTrack("map_country_click", { country });
    }
  }

  function createTooltip(map) {
    let tooltip = map.querySelector(".jooking-map-tooltip");
    if (tooltip) return tooltip;

    tooltip = document.createElement("div");
    tooltip.className = "jooking-map-tooltip";
    tooltip.setAttribute("aria-hidden", "true");
    map.appendChild(tooltip);
    return tooltip;
  }

  function positionTooltip(map, tooltip, pin, text) {
    const mapRect = map.getBoundingClientRect();
    const pinRect = pin.getBoundingClientRect();

    tooltip.textContent = text;
    tooltip.style.opacity = "1";

    const left = pinRect.left - mapRect.left + pinRect.width / 2;
    const top = pinRect.top - mapRect.top - 12;

    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${top}px`;
  }

  function renderPins(countries) {
    const maps = document.querySelectorAll(".hero-map, #worldRiskMap");
    if (!maps.length) return;

    maps.forEach(map => {
      removeExistingPins(map);
      const tooltip = createTooltip(map);

      countries.forEach(item => {
        const rawCoords = COUNTRY_COORDS[item.country];
        if (!rawCoords) {
          console.warn("Jooking map: missing coordinates for", item.country);
          return;
        }

        const pos = clampPosition(rawCoords[0], rawCoords[1]);

        const pin = document.createElement("button");
        pin.type = "button";
        pin.className = `map-pin jooking-dynamic-map-pin ${level(item.count)}`;
        pin.dataset.country = item.country;
        pin.dataset.count = String(item.count);
        pin.style.left = `${pos.left}%`;
        pin.style.top = `${pos.top}%`;
        pin.title = `${item.country} — ${item.count} reported place${item.count === 1 ? "" : "s"}`;
        pin.setAttribute("aria-label", pin.title);

        pin.addEventListener("click", event => {
          event.preventDefault();
          event.stopPropagation();
          runSearch(item.country);
        });

        pin.addEventListener("mouseenter", () => {
          positionTooltip(map, tooltip, pin, pin.title);
        });

        pin.addEventListener("mousemove", () => {
          positionTooltip(map, tooltip, pin, pin.title);
        });

        pin.addEventListener("mouseleave", () => {
          tooltip.style.opacity = "0";
        });

        pin.addEventListener("focus", () => {
          positionTooltip(map, tooltip, pin, pin.title);
        });

        pin.addEventListener("blur", () => {
          tooltip.style.opacity = "0";
        });

        map.appendChild(pin);
      });

      const legend = map.querySelector(".map-legend");
      if (legend && !legend.querySelector(".live-count")) {
        const total = countries.reduce((sum, item) => sum + item.count, 0);
        const live = document.createElement("div");
        live.className = "legend-row live-count";
        live.innerHTML = `<span class="legend-pin na"></span> Live: ${total} reports`;
        legend.appendChild(live);
      }
    });
  }

  async function init() {
    const rows = await loadRows();
    const countries = groupByCountry(rows);
    renderPins(countries);

    window.jookingMapCountries = countries;
    console.info("Jooking map countries:", countries.map(c => `${c.country}: ${c.count}`).join(", "));
  }

  document.addEventListener("DOMContentLoaded", init);
  window.addEventListener("load", () => setTimeout(init, 500));
})();
