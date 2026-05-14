/* AntiBooking V2.5.6 - Supabase-only Friendly Places */

let friendlyPlaces = [];
let currentFriendly = [];

function mapFriendlyPlace(row) {
  return {
    id: row.id,
    name: row.place_name || "Unnamed friendly place",
    category: row.category || "Other",
    city: row.city || "Unknown",
    country: row.country || "Unknown",
    badge: row.badge || "Evidence-first friendly",
    badgeClass: badgeClassFromText(row.badge || row.confidence || ""),
    imageClass: imageClassFromCategory(row.category || ""),
    website: row.website || "#",
    sourceLabel: row.source_label || "Source",
    sourceUrl: row.source_url || row.website || "#",
    summary: row.summary || "",
    details: row.details || row.summary || ""
  };
}

function badgeClassFromText(value) {
  const v = String(value || "").toLowerCase();
  if (v.includes("verified")) return "verified";
  if (v.includes("trusted")) return "trusted";
  if (v.includes("safe")) return "safe";
  return "safe";
}

function imageClassFromCategory(value) {
  const v = String(value || "").toLowerCase();
  if (v.includes("hotel")) return "hotel";
  if (v.includes("community")) return "community";
  if (v.includes("cafe") || v.includes("restaurant")) return "cafe";
  return "district";
}

async function loadFriendlyPlacesFromSupabase() {
  if (!window.antibookingSupabase) {
    console.error("Supabase client not found: antibookingSupabase is missing.");
    friendlyPlaces = [];
    currentFriendly = [];
    return;
  }

  const { data, error } = await window.antibookingSupabase
    .from("friendly_places")
    .select("*")
    .eq("status", "approved")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Could not load friendly_places from Supabase:", error);
    friendlyPlaces = [];
    currentFriendly = [];
    return;
  }

  const rows = Array.isArray(data) ? data : [];
  console.info(`AntiBooking Supabase approved friendly places loaded: ${rows.length}`);

  friendlyPlaces = rows.map(mapFriendlyPlace);
  currentFriendly = [...friendlyPlaces];
}

function initFriendlyFilters() {
  const country = document.getElementById("friendlyCountry");
  const city = document.getElementById("friendlyCity");
  const category = document.getElementById("friendlyCategory");
  if (!country || !city || !category) return;

  country.innerHTML = '<option value="all">All countries</option>';
  [...new Set(friendlyPlaces.map(p => p.country))].sort().forEach(value => {
    country.innerHTML += `<option value="${safeAttr(value)}">${safeHtml(value)}</option>`;
  });

  category.innerHTML = '<option value="all">All categories</option>';
  [...new Set(friendlyPlaces.map(p => p.category))].sort().forEach(value => {
    category.innerHTML += `<option value="${safeAttr(value)}">${safeHtml(value)}</option>`;
  });

  country.addEventListener("change", updateFriendlyCities);
  city.addEventListener("change", filterFriendlyPlaces);
  category.addEventListener("change", filterFriendlyPlaces);

  updateFriendlyCities();
}

function updateFriendlyCities() {
  const countryEl = document.getElementById("friendlyCountry");
  const cityEl = document.getElementById("friendlyCity");
  if (!countryEl || !cityEl) return;

  const selectedCountry = countryEl.value;
  const cities = [...new Set(
    friendlyPlaces
      .filter(p => selectedCountry === "all" || p.country === selectedCountry)
      .map(p => p.city)
  )].sort();

  cityEl.innerHTML = '<option value="all">All cities</option>';
  cities.forEach(value => {
    cityEl.innerHTML += `<option value="${safeAttr(value)}">${safeHtml(value)}</option>`;
  });

  filterFriendlyPlaces();
}

function filterFriendlyPlaces() {
  const country = document.getElementById("friendlyCountry")?.value || "all";
  const city = document.getElementById("friendlyCity")?.value || "all";
  const category = document.getElementById("friendlyCategory")?.value || "all";

  currentFriendly = friendlyPlaces.filter(p =>
    (country === "all" || p.country === country) &&
    (city === "all" || p.city === city) &&
    (category === "all" || p.category === category)
  );

  renderFriendlyPlaces();
}

function resetFriendlyFilters() {
  const country = document.getElementById("friendlyCountry");
  const category = document.getElementById("friendlyCategory");
  if (country) country.value = "all";
  if (category) category.value = "all";
  updateFriendlyCities();
}

function renderFriendlyPlaces() {
  const box = document.getElementById("friendlyCards");
  const count = document.getElementById("friendlyCount");
  if (!box) return;

  if (count) {
    count.textContent = `Showing ${currentFriendly.length} approved friendly place${currentFriendly.length !== 1 ? "s" : ""} from Supabase.`;
  }

  if (currentFriendly.length === 0) {
    box.innerHTML = `
      <div class="friendly-empty">
        <h3>No approved friendly places yet</h3>
        <p>Your Supabase table <strong>friendly_places</strong> currently has no approved rows.</p>
      </div>
    `;
    return;
  }

  box.innerHTML = currentFriendly.map(place => `
    <article class="friendly-card">
      <div class="friendly-image ${safeAttr(place.imageClass)}"></div>
      <div class="friendly-content">
        <div class="friendly-tags">
          <span class="friendly-badge ${safeAttr(place.badgeClass)}">${safeHtml(place.badge)}</span>
          <span class="friendly-badge city">${safeHtml(place.city)}</span>
        </div>
        <h3>${safeHtml(place.name)}</h3>
        <p>${safeHtml(place.summary)}</p>
        <div class="friendly-links">
          <button class="friendly-link" onclick="openFriendlyDetails('${safeAttr(place.id)}')">Details</button>
          ${place.website && place.website !== "#" ? `<a class="friendly-link website" href="${safeAttr(place.website)}" target="_blank" rel="noopener noreferrer">Website</a>` : ""}
        </div>
        <div class="friendly-meta">
          <span>${safeHtml(place.country)}</span>
          <span>${safeHtml(place.category)}</span>
        </div>
      </div>
    </article>
  `).join("");
}

function openFriendlyDetails(id) {
  const place = friendlyPlaces.find(p => String(p.id) === String(id));
  if (!place) return;

  document.getElementById("friendlyModalContent").innerHTML = `
    <div class="friendly-tags">
      <span class="friendly-badge ${safeAttr(place.badgeClass)}">${safeHtml(place.badge)}</span>
      <span class="friendly-badge city">${safeHtml(place.city)}, ${safeHtml(place.country)}</span>
    </div>
    <h2>${safeHtml(place.name)}</h2>
    <p><strong>Category:</strong> ${safeHtml(place.category)}</p>
    <p>${safeHtml(place.details)}</p>
    <div class="source-box">
      <strong>Evidence / source</strong>
      <p>${safeHtml(place.sourceLabel)}</p>
      ${place.sourceUrl && place.sourceUrl !== "#" ? `<p><a href="${safeAttr(place.sourceUrl)}" target="_blank" rel="noopener noreferrer">Open source</a></p>` : ""}
      ${place.website && place.website !== "#" ? `<p><a href="${safeAttr(place.website)}" target="_blank" rel="noopener noreferrer">Open website</a></p>` : ""}
    </div>
  `;

  document.getElementById("friendlyModalBackdrop").style.display = "flex";
}

function closeFriendlyModal() {
  document.getElementById("friendlyModalBackdrop").style.display = "none";
}

function safeHtml(value) {
  return String(value || "").replace(/[<>&"]/g, c => ({ "<":"&lt;", ">":"&gt;", "&":"&amp;", '"':"&quot;" }[c]));
}

function safeAttr(value) {
  return safeHtml(value).replace(/'/g, "&#39;");
}

document.addEventListener("DOMContentLoaded", async () => {
  await loadFriendlyPlacesFromSupabase();
  initFriendlyFilters();
  renderFriendlyPlaces();

  const backdrop = document.getElementById("friendlyModalBackdrop");
  if (backdrop) {
    backdrop.addEventListener("click", event => {
      if (event.target.id === "friendlyModalBackdrop") closeFriendlyModal();
    });
  }
});
