const friendlyPlaces = [
  {
    name: "Chabad Finland",
    category: "Community",
    city: "Helsinki",
    country: "Finland",
    badge: "Verified Friendly",
    badgeClass: "verified",
    imageClass: "community",
    summary: "Jewish community support point for travelers, including Shabbat support and local guidance."
  },
  {
    name: "Jewish Community of Helsinki",
    category: "Community",
    city: "Helsinki",
    country: "Finland",
    badge: "Verified Friendly",
    badgeClass: "verified",
    imageClass: "community",
    summary: "Official Jewish community infrastructure and a useful orientation point for Jewish visitors."
  },
  {
    name: "Hotel Kämp",
    category: "Hotel",
    city: "Helsinki",
    country: "Finland",
    badge: "Community Trusted",
    badgeClass: "trusted",
    imageClass: "hotel",
    summary: "International luxury hotel used by global travelers; no documented AntiBooking risk signal currently identified."
  },
  {
    name: "Hotel St. George Helsinki",
    category: "Hotel",
    city: "Helsinki",
    country: "Finland",
    badge: "Community Trusted",
    badgeClass: "trusted",
    imageClass: "hotel",
    summary: "International upscale hotel in central Helsinki, suitable for global travelers and business visitors."
  },
  {
    name: "Café Regatta",
    category: "Cafe",
    city: "Helsinki",
    country: "Finland",
    badge: "Safe Tourist Area",
    badgeClass: "safe",
    imageClass: "cafe",
    summary: "Very popular tourist café in a calm, international visitor environment."
  },
  {
    name: "Punavuori / Design District",
    category: "District",
    city: "Helsinki",
    country: "Finland",
    badge: "Safe Tourist Area",
    badgeClass: "safe",
    imageClass: "district",
    summary: "International, central and tourist-friendly area with a generally comfortable atmosphere for visitors."
  }
];

function renderFriendlyPlaces() {
  const box = document.getElementById("friendlyCards");
  if (!box) return;

  box.innerHTML = friendlyPlaces.map(place => `
    <article class="friendly-card">
      <div class="friendly-image ${place.imageClass}"></div>
      <div class="friendly-content">
        <div class="friendly-tags">
          <span class="friendly-badge ${place.badgeClass}">${place.badge}</span>
          <span class="friendly-badge city">${place.city}</span>
        </div>
        <h3>${place.name}</h3>
        <p>${place.summary}</p>
        <div class="friendly-meta">
          <span>🇫🇮 ${place.country}</span>
          <span>${place.category}</span>
        </div>
      </div>
    </article>
  `).join("");
}

document.addEventListener("DOMContentLoaded", renderFriendlyPlaces);
