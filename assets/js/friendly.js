const friendlyPlaces = [
  {id:"chabad-finland",name:"Chabad Finland",category:"Community",city:"Helsinki",country:"Finland",badge:"Verified Friendly",badgeClass:"verified",imageClass:"community",website:"https://www.chabad.fi/",sourceLabel:"Official community website",sourceUrl:"https://www.chabad.fi/",summary:"Jewish community support point for travelers, including Shabbat support and local guidance.",details:"Useful for Jewish and Israeli travelers looking for local orientation, Shabbat/holiday support and Jewish infrastructure in Helsinki. Listed as Friendly because it is direct Jewish infrastructure rather than a commercial endorsement."},
  {id:"jewish-community-helsinki",name:"Jewish Community of Helsinki",category:"Community",city:"Helsinki",country:"Finland",badge:"Verified Friendly",badgeClass:"verified",imageClass:"community",website:"https://jchelsinki.fi/",sourceLabel:"Official community website",sourceUrl:"https://jchelsinki.fi/",summary:"Official Jewish community infrastructure and a useful orientation point for Jewish visitors.",details:"Evidence-first positive listing based on official Jewish community presence, not a tourism sponsorship. Useful as a trust anchor for visitors planning Jewish life logistics in Finland."},
  {id:"hotel-kamp",name:"Hotel Kämp",category:"Hotel",city:"Helsinki",country:"Finland",badge:"Community Trusted",badgeClass:"trusted",imageClass:"hotel",website:"https://www.hotelkamp.com/",sourceLabel:"Official hotel website + international traveler reputation",sourceUrl:"https://www.hotelkamp.com/",summary:"International luxury hotel used by global travelers; no documented AntiBooking risk signal currently identified.",details:"Starter Friendly listing for an internationally oriented hotel in central Helsinki. Needs community feedback over time before upgrading to Verified Friendly."},
  {id:"hotel-st-george",name:"Hotel St. George Helsinki",category:"Hotel",city:"Helsinki",country:"Finland",badge:"Community Trusted",badgeClass:"trusted",imageClass:"hotel",website:"https://www.stgeorgehelsinki.com/",sourceLabel:"Official hotel website + international traveler reputation",sourceUrl:"https://www.stgeorgehelsinki.com/",summary:"International upscale hotel in central Helsinki, suitable for global travelers and business visitors.",details:"Starter positive listing based on international positioning and no current AntiBooking risk signal. Should be enriched with user recommendations."},
  {id:"cafe-regatta",name:"Café Regatta",category:"Cafe",city:"Helsinki",country:"Finland",badge:"Safe Tourist Area",badgeClass:"safe",imageClass:"cafe",website:"https://www.caferegatta.fi/",sourceLabel:"Official café website + tourist reputation",sourceUrl:"https://www.caferegatta.fi/",summary:"Popular tourist café in a calm, international visitor environment.",details:"Listed as Safe Tourist Area rather than Verified Friendly. This means no special Jewish/Israeli service signal yet, but a positive travel environment signal."},
  {id:"punavuori-design-district",name:"Punavuori / Design District",category:"District",city:"Helsinki",country:"Finland",badge:"Safe Tourist Area",badgeClass:"safe",imageClass:"district",website:"https://www.myhelsinki.fi/",sourceLabel:"Helsinki tourism information + traveler environment",sourceUrl:"https://www.myhelsinki.fi/",summary:"International, central and tourist-friendly area with a generally comfortable atmosphere for visitors.",details:"Area-level positive travel signal. This does not mean every business is verified; it helps travelers orient toward comfortable international neighborhoods."}
];

let currentFriendly = [...friendlyPlaces];

function initFriendlyFilters() {
  const country = document.getElementById("friendlyCountry");
  const city = document.getElementById("friendlyCity");
  const category = document.getElementById("friendlyCategory");
  if (!country || !city || !category) return;

  country.innerHTML = '<option value="all">All countries</option>';
  [...new Set(friendlyPlaces.map(p => p.country))].sort().forEach(value => country.innerHTML += `<option value="${value}">${value}</option>`);

  category.innerHTML = '<option value="all">All categories</option>';
  [...new Set(friendlyPlaces.map(p => p.category))].sort().forEach(value => category.innerHTML += `<option value="${value}">${value}</option>`);

  country.addEventListener("change", updateFriendlyCities);
  city.addEventListener("change", filterFriendlyPlaces);
  category.addEventListener("change", filterFriendlyPlaces);
  updateFriendlyCities();
}

function updateFriendlyCities() {
  const selectedCountry = document.getElementById("friendlyCountry").value;
  const city = document.getElementById("friendlyCity");
  const cities = [...new Set(friendlyPlaces.filter(p => selectedCountry === "all" || p.country === selectedCountry).map(p => p.city))].sort();
  city.innerHTML = '<option value="all">All cities</option>';
  cities.forEach(value => city.innerHTML += `<option value="${value}">${value}</option>`);
  filterFriendlyPlaces();
}

function filterFriendlyPlaces() {
  const country = document.getElementById("friendlyCountry").value;
  const city = document.getElementById("friendlyCity").value;
  const category = document.getElementById("friendlyCategory").value;
  currentFriendly = friendlyPlaces.filter(p => (country === "all" || p.country === country) && (city === "all" || p.city === city) && (category === "all" || p.category === category));
  renderFriendlyPlaces();
}

function resetFriendlyFilters() {
  document.getElementById("friendlyCountry").value = "all";
  updateFriendlyCities();
  document.getElementById("friendlyCategory").value = "all";
  filterFriendlyPlaces();
}

function renderFriendlyPlaces() {
  const box = document.getElementById("friendlyCards");
  const count = document.getElementById("friendlyCount");
  if (!box) return;
  if (count) count.textContent = `Showing ${currentFriendly.length} evidence-first friendly place${currentFriendly.length > 1 ? "s" : ""}.`;
  box.innerHTML = currentFriendly.map(place => `
    <article class="friendly-card">
      <div class="friendly-image ${place.imageClass}"></div>
      <div class="friendly-content">
        <div class="friendly-tags"><span class="friendly-badge ${place.badgeClass}">${place.badge}</span><span class="friendly-badge city">${place.city}</span></div>
        <h3>${place.name}</h3>
        <p>${place.summary}</p>
        <div class="friendly-links"><button class="friendly-link" onclick="openFriendlyDetails('${place.id}')">Details</button><a class="friendly-link website" href="${place.website}" target="_blank" rel="noopener noreferrer">Website</a></div>
        <div class="friendly-meta"><span>${place.country}</span><span>${place.category}</span></div>
      </div>
    </article>`).join("");
}

function openFriendlyDetails(id) {
  const place = friendlyPlaces.find(p => p.id === id);
  if (!place) return;
  document.getElementById("friendlyModalContent").innerHTML = `
    <div class="friendly-tags"><span class="friendly-badge ${place.badgeClass}">${place.badge}</span><span class="friendly-badge city">${place.city}, ${place.country}</span></div>
    <h2>${place.name}</h2>
    <p><strong>Category:</strong> ${place.category}</p>
    <p>${place.details}</p>
    <div class="source-box"><strong>Evidence / source</strong><p>${place.sourceLabel}</p><p><a href="${place.sourceUrl}" target="_blank" rel="noopener noreferrer">Open source</a></p><p><a href="${place.website}" target="_blank" rel="noopener noreferrer">Open website</a></p></div>`;
  document.getElementById("friendlyModalBackdrop").style.display = "flex";
}

function closeFriendlyModal() { document.getElementById("friendlyModalBackdrop").style.display = "none"; }

document.addEventListener("DOMContentLoaded", () => {
  initFriendlyFilters();
  const backdrop = document.getElementById("friendlyModalBackdrop");
  if (backdrop) backdrop.addEventListener("click", event => { if (event.target.id === "friendlyModalBackdrop") closeFriendlyModal(); });
});
