window.JOOKING_FORCE_HIGH_COUNTRIES = ["United States", "Italy", "Japan"];
window.JOOKING_COUNTRY_ALIASES = {
  "us":"United States","usa":"United States","u.s.":"United States","u.s.a.":"United States",
  "united states of america":"United States","america":"United States","uk":"United Kingdom",
  "u.k.":"United Kingdom","great britain":"United Kingdom","england":"United Kingdom",
  "it":"Italy","italia":"Italy","jp":"Japan","japon":"Japan","de":"Germany","fr":"France","es":"Spain"
};

window.JOOKING_COUNTRY_LONLAT = {
  "United States":[-98,39],"Canada":[-106,57],"Mexico":[-102,23],"Colombia":[-74,4],"Brazil":[-52,-10],
  "Argentina":[-64,-34],"Chile":[-71,-30],"United Kingdom":[-2,54],"Ireland":[-8,53],"Portugal":[-8,39],
  "Spain":[-4,40],"France":[2,46],"Belgium":[4,51],"Netherlands":[5,52],"Germany":[10,51],
  "Switzerland":[8,47],"Austria":[14,47],"Italy":[12.5,42.5],"Norway":[8,62],"Sweden":[15,62],
  "Finland":[26,64],"Denmark":[10,56],"Poland":[19,52],"Czech Republic":[15,49.8],"Hungary":[19,47],
  "Romania":[25,46],"Bulgaria":[25,43],"Croatia":[16,45],"Serbia":[21,44],"Bosnia":[18,44],
  "Bosnia and Herzegovina":[18,44],"Greece":[22,39],"Cyprus":[33,35],"Turkey":[35,39],"Israel":[35,31.5],
  "United Arab Emirates":[54,24],"Egypt":[30,27],"Morocco":[-7,32],"Tunisia":[10,34],"South Africa":[24,-29],
  "Kyrgyzstan":[75,41],"Maldives":[73,4],"Thailand":[101,15],"Vietnam":[108,16],"Japan":[138,37],"Australia":[134,-25]
};

function jookingProjectLonLat(lon, lat) {
  return [((Number(lon) + 180) / 360) * 100, ((90 - Number(lat)) / 180) * 100];
}

window.JOOKING_COUNTRY_COORDINATES = Object.fromEntries(
  Object.entries(window.JOOKING_COUNTRY_LONLAT).map(([country,ll]) => [country,jookingProjectLonLat(ll[0],ll[1])])
);

function jookingNormalizeCountry(country) {
  const raw = String(country || "").trim();
  return window.JOOKING_COUNTRY_ALIASES[raw.toLowerCase()] || raw;
}

function jookingRiskClient() {
  if (window.antibookingSupabase) return window.antibookingSupabase;
  if (window.supabaseClient) return window.supabaseClient;
  try { if (typeof antibookingSupabase !== "undefined") return antibookingSupabase; } catch(e) {}
  return null;
}

async function jookingLoadRiskRows() {
  const client = jookingRiskClient();
  if (!client) throw new Error("Data client missing");
  const { data, error } = await client.from("incidents")
    .select("id,country,city,category,status,tourism_type,incident_date,created_at")
    .eq("status","approved");
  if (error) throw error;
  return Array.isArray(data) ? data : [];
}

function jookingGroupCountries(rows) {
  const grouped = {};
  rows.forEach(row => {
    const country = jookingNormalizeCountry(row.country || "Unknown");
    if (!grouped[country]) grouped[country] = { country, count:0, direct:0, related:0, categories:{}, latest:null };
    const item = grouped[country];
    item.count += 1;
    if (String(row.tourism_type || "").toLowerCase().includes("related")) item.related += 1; else item.direct += 1;
    const category = row.category || "Other";
    item.categories[category] = (item.categories[category] || 0) + 1;
    const date = row.incident_date || row.created_at;
    if (date && (!item.latest || new Date(date) > new Date(item.latest))) item.latest = date;
  });

  return Object.values(grouped).map(item => {
    const rawScore = item.direct * 4 + item.related * 2;
    const score = window.JOOKING_FORCE_HIGH_COUNTRIES.includes(item.country) ? Math.max(rawScore,12) : rawScore;
    return { ...item, score };
  }).sort((a,b) => b.score - a.score || a.country.localeCompare(b.country));
}

function jookingRiskLevel(score) { return score >= 12 ? "high" : score >= 5 ? "medium" : "low"; }
function jookingSlug(value) { return String(value || "").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,""); }
function jookingEsc(value) { return String(value || "").replace(/[<>&"]/g,c=>({"<":"&lt;",">":"&gt;","&":"&amp;",'"':"&quot;"}[c])); }
function jookingFormatDate(value) { const d=new Date(value); return Number.isNaN(d.getTime())?value:d.toLocaleDateString("en-US",{year:"numeric",month:"short",day:"numeric"}); }
function jookingGetCoordinates(country) { return window.JOOKING_COUNTRY_COORDINATES[jookingNormalizeCountry(country)] || null; }
function jookingClearPins(container) { container.querySelectorAll(".map-pin,.country-pin,.jooking-risk-pin,.jooking-dynamic-map-pin,.legacy-map-pin,.map-marker").forEach(pin=>pin.remove()); }

function jookingRenderPins(container, countries, options={}) {
  if (!container) return;
  const type = options.type || "home";
  jookingClearPins(container);

  countries.map(item => ({...item,country:jookingNormalizeCountry(item.country),coords:jookingGetCoordinates(item.country)}))
    .filter(item => item.coords)
    .forEach(item => {
      const level = jookingRiskLevel(item.score || item.count || 0);
      const pin = document.createElement("button");
      pin.type = "button";
      pin.className = type === "risk" ? `country-pin ${level} jooking-risk-pin` : `jooking-dynamic-map-pin ${level} jooking-risk-pin`;
      pin.style.left = `${item.coords[0]}%`;
      pin.style.top = `${item.coords[1]}%`;
      pin.title = `${item.country}: ${item.count} approved report${item.count===1?"":"s"}`;
      pin.setAttribute("aria-label",pin.title);
      pin.addEventListener("click",()=>{
        if (type === "risk") {
          document.getElementById(`country-${jookingSlug(item.country)}`)?.scrollIntoView({behavior:"smooth",block:"center"});
        } else {
          const select = document.getElementById("countrySelect");
          const option = select && Array.from(select.options).find(o=>jookingNormalizeCountry(o.value)===item.country || jookingNormalizeCountry(o.textContent)===item.country);
          if (select && option) {
            select.value = option.value;
            select.dispatchEvent(new Event("change",{bubbles:true}));
            if (typeof window.filterIncidents === "function") window.filterIncidents();
            setTimeout(()=>document.getElementById("resultsGrid")?.scrollIntoView({behavior:"smooth",block:"start"}),180);
          } else {
            window.location.href = `/pages/country-risk.html#country-${jookingSlug(item.country)}`;
          }
        }
      });
      container.appendChild(pin);
    });
}

window.JookingRiskMap = {
  normalizeCountry:jookingNormalizeCountry,loadRiskRows:jookingLoadRiskRows,groupCountries:jookingGroupCountries,
  riskLevel:jookingRiskLevel,slug:jookingSlug,esc:jookingEsc,formatDate:jookingFormatDate,
  renderPins:jookingRenderPins,getCoordinates:jookingGetCoordinates
};
