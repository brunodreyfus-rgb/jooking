/* Jooking V2.5.29 - clean single homepage world-map renderer */
(function () {
  if (window.__JOOKING_SINGLE_MAP_RENDERER_V2529__) return;
  window.__JOOKING_SINGLE_MAP_RENDERER_V2529__ = true;

  const COUNTRY_POS = {
    "United States": [22, 39], "USA": [22, 39], "Canada": [22, 24], "Mexico": [20, 48],
    "Colombia": [31, 58], "Brazil": [35, 67], "Argentina": [31, 78], "Chile": [29, 78],
    "United Kingdom": [47.2, 33.5], "Ireland": [46, 34.5], "Portugal": [46.4, 41.2],
    "Spain": [47.8, 41], "France": [49, 38], "Belgium": [49.6, 35.8],
    "Netherlands": [49.9, 34.5], "Germany": [51, 36.4], "Switzerland": [50.5, 39],
    "Austria": [52, 39], "Italy": [51.8, 43], "Norway": [50.8, 27],
    "Sweden": [52.4, 28.5], "Finland": [54.3, 26.5], "Denmark": [51, 32],
    "Poland": [53.3, 36], "Czech Republic": [52.1, 37], "Hungary": [53.2, 39.8],
    "Romania": [55, 40], "Bulgaria": [55.4, 42], "Croatia": [52.7, 41],
    "Serbia": [53.6, 41.2], "Bosnia": [52.4, 40.8], "Bosnia and Herzegovina": [52.4, 40.8],
    "Greece": [54.8, 45.2], "Cyprus": [57.8, 47], "Turkey": [58, 43.5],
    "Israel": [58.8, 47], "United Arab Emirates": [64.2, 51], "Egypt": [56.2, 50],
    "Morocco": [47.2, 49], "Tunisia": [51.5, 48], "South Africa": [53.2, 82],
    "Kyrgyzstan": [68, 42], "Maldives": [67, 64], "Thailand": [75, 58],
    "Vietnam": [77.5, 57], "Japan": [84, 43], "Australia": [82, 76]
  };

  function canonicalCountry(value) {
    const v = String(value || "").trim();
    if (!v) return "";
    if (["US", "U.S.", "U.S.A.", "USA", "United States of America"].includes(v)) return "United States";
    if (v === "UK") return "United Kingdom";
    if (v === "Bosnia & Herzegovina") return "Bosnia and Herzegovina";
    return v;
  }

  function getClient() {
    if (window.antibookingSupabase) return window.antibookingSupabase;
    if (window.supabaseClient) return window.supabaseClient;
    try { if (typeof antibookingSupabase !== "undefined") return antibookingSupabase; } catch (e) {}
    return null;
  }

  async function loadApprovedIncidents() {
    const client = getClient();
    if (!client) return [];
    const { data, error } = await client.from("incidents").select("id,country,city,category,status").eq("status", "approved");
    if (error) {
      console.error("Jooking map: failed loading incidents", error);
      return [];
    }
    return Array.isArray(data) ? data : [];
  }

  function groupCountries(rows) {
    const grouped = {};
    rows.forEach(row => {
      const country = canonicalCountry(row.country);
      if (!country) return;
      if (!grouped[country]) grouped[country] = { country, count: 0, cities: new Set(), categories: new Set() };
      grouped[country].count += 1;
      if (row.city) grouped[country].cities.add(row.city);
      if (row.category) grouped[country].categories.add(row.category);
    });
    return Object.values(grouped)
      .map(item => ({ ...item, cities: Array.from(item.cities), categories: Array.from(item.categories) }))
      .sort((a, b) => b.count - a.count || a.country.localeCompare(b.country));
  }

  function level(count) {
    if (count >= 5) return "high";
    if (count >= 2) return "medium";
    return "low";
  }

  function clamp(left, top) {
    return { left: Math.max(5, Math.min(86, Number(left))), top: Math.max(8, Math.min(84, Number(top))) };
  }

  function findCountryOption(country) {
    const select = document.getElementById("countrySelect");
    if (!select) return null;
    return Array.from(select.options).find(option => {
      const value = canonicalCountry(option.value);
      const label = canonicalCountry(option.textContent);
      return value === country || label === country;
    });
  }

  function runSearch(country) {
    const countrySelect = document.getElementById("countrySelect");
    const citySelect = document.getElementById("citySelect");
    const categorySelect = document.getElementById("categorySelect");
    const option = findCountryOption(country);
    if (!countrySelect || !option) return;

    countrySelect.value = option.value;
    countrySelect.dispatchEvent(new Event("change", { bubbles: true }));
    if (citySelect) { citySelect.value = "all"; citySelect.dispatchEvent(new Event("change", { bubbles: true })); }
    if (categorySelect) { categorySelect.value = "all"; categorySelect.dispatchEvent(new Event("change", { bubbles: true })); }

    if (typeof window.filterIncidents === "function") window.filterIncidents();
    else document.querySelector(".search-grid .btn")?.click();

    setTimeout(() => {
      const first = document.querySelector("#resultsGrid > article") ||
        document.querySelector("#resultsGrid > div:not(.empty-state)") ||
        document.getElementById("resultsGrid");
      first?.scrollIntoView({ behavior: "smooth", block: "start" });
      first?.classList.add("jooking-report-highlight");
      setTimeout(() => first?.classList.remove("jooking-report-highlight"), 1700);

      const hint = document.querySelector(".search-title .search-result-hint");
      const countText = document.getElementById("resultCount")?.textContent || "";
      const n = (countText.match(/\d+/) || [""])[0];
      if (hint) hint.textContent = n ? `${n} reported place${n === "1" ? "" : "s"} below for ${country}` : `Reported places below for ${country}`;
    }, 260);

    if (typeof window.jookingTrack === "function") window.jookingTrack("map_country_click", { country });
  }

  function cleanMap(map) {
    map.querySelectorAll(".map-pin, .jooking-dynamic-map-pin, .jooking-map-tooltip, .legacy-map-pin, .map-marker").forEach(el => el.remove());
  }

  function tooltipFor(map) {
    let tooltip = map.querySelector(".jooking-map-tooltip");
    if (!tooltip) {
      tooltip = document.createElement("div");
      tooltip.className = "jooking-map-tooltip";
      map.appendChild(tooltip);
    }
    return tooltip;
  }

  function showTooltip(map, tooltip, pin, label) {
    const mapRect = map.getBoundingClientRect();
    const pinRect = pin.getBoundingClientRect();
    tooltip.textContent = label;
    tooltip.style.left = `${pinRect.left - mapRect.left + pinRect.width / 2}px`;
    tooltip.style.top = `${pinRect.top - mapRect.top - 12}px`;
    tooltip.style.opacity = "1";
  }

  function renderLegend(map, countries) {
    const legend = map.querySelector(".map-legend");
    if (!legend) return;
    legend.querySelectorAll(".live-count").forEach(el => el.remove());
    const total = countries.reduce((sum, item) => sum + item.count, 0);
    const live = document.createElement("div");
    live.className = "legend-row live-count";
    live.innerHTML = `<span class="legend-pin na"></span> Live: ${total} reports`;
    legend.appendChild(live);
  }

  function renderMap(countries) {
    const maps = document.querySelectorAll(".hero-map, #worldRiskMap");
    maps.forEach(map => {
      cleanMap(map);
      const tooltip = tooltipFor(map);

      countries.forEach(item => {
        const coords = COUNTRY_POS[item.country];
        if (!coords) {
          console.warn("Jooking map: missing coordinates for country:", item.country);
          return;
        }

        const pos = clamp(coords[0], coords[1]);
        const title = `${item.country} — ${item.count} reported place${item.count === 1 ? "" : "s"}`;
        const pin = document.createElement("button");
        pin.type = "button";
        pin.className = `jooking-dynamic-map-pin ${level(item.count)}`;
        pin.dataset.country = item.country;
        pin.dataset.count = String(item.count);
        pin.style.left = `${pos.left}%`;
        pin.style.top = `${pos.top}%`;
        pin.title = title;
        pin.setAttribute("aria-label", title);

        pin.addEventListener("click", event => {
          event.preventDefault();
          event.stopPropagation();
          runSearch(item.country);
        });
        pin.addEventListener("mouseenter", () => showTooltip(map, tooltip, pin, title));
        pin.addEventListener("mousemove", () => showTooltip(map, tooltip, pin, title));
        pin.addEventListener("mouseleave", () => tooltip.style.opacity = "0");
        pin.addEventListener("focus", () => showTooltip(map, tooltip, pin, title));
        pin.addEventListener("blur", () => tooltip.style.opacity = "0");
        map.appendChild(pin);
      });

      renderLegend(map, countries);
    });
  }

  async function init() {
    const rows = await loadApprovedIncidents();
    const countries = groupCountries(rows);
    window.jookingMapCountries = countries;
    console.info("Jooking map rendered countries:", countries.map(c => `${c.country}:${c.count}`).join(", "));
    renderMap(countries);
  }

  document.addEventListener("DOMContentLoaded", init);
  window.addEventListener("load", () => setTimeout(init, 450));
})();
