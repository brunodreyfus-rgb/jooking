/* AntiBooking V2.5.13 - Homepage map pins from Supabase */
const HOME_COUNTRY_COORDS = {
  "Argentina / Spain":[43,54],"Australia":[82,82],"Austria":[51,35],"Bosnia":[51,39],
  "Colombia":[29,56],"Finland":[53,23],"France":[48,37],"Germany":[51,34],
  "Greece":[53,42],"Italy":[50,42],"Japan":[84,43],"Kyrgyzstan":[67,41],
  "Norway":[50,25],"Spain":[47,40],"Thailand":[74,56],"United Kingdom":[47,33],
  "United States":[22,43],"Vietnam":[76,56]
};

function getHomeMapClient(){
  if(window.antibookingSupabase) return window.antibookingSupabase;
  if(window.supabaseClient) return window.supabaseClient;
  try { if(typeof antibookingSupabase !== "undefined") return antibookingSupabase; } catch(e){}
  return null;
}
function homeRiskLevel(count){ if(count>=5) return "high"; if(count>=2) return "medium"; return "low"; }

async function loadHomeRiskRows(){
  const client = getHomeMapClient();
  if(!client) return [];
  const {data,error} = await client.from("incidents").select("id,country,status,tourism_type").eq("status","approved");
  if(error){ console.error("Home map could not load incidents", error); return []; }
  return Array.isArray(data) ? data : [];
}

function groupHomeCountries(rows){
  const grouped = {};
  rows.forEach(row => {
    const country = row.country || "Unknown";
    if(!grouped[country]) grouped[country] = {country, count:0, direct:0, related:0};
    grouped[country].count += 1;
    if(String(row.tourism_type || "").includes("related")) grouped[country].related += 1;
    else grouped[country].direct += 1;
  });
  return Object.values(grouped).map(c => ({...c, score:c.direct*4+c.related*2})).sort((a,b)=>b.score-a.score);
}

function renderHomeRiskPins(countries){
  const map = document.querySelector(".hero-map");
  if(!map) return;
  map.querySelectorAll(".map-pin").forEach(pin => pin.remove());

  countries.forEach(item => {
    const coords = HOME_COUNTRY_COORDS[item.country];
    if(!coords) return;
    const pin = document.createElement("span");
    pin.className = `map-pin ${homeRiskLevel(item.count)}`;
    pin.style.left = `${coords[0]}%`;
    pin.style.top = `${coords[1]}%`;
    pin.title = `${item.country}: ${item.count} approved report${item.count === 1 ? "" : "s"}`;
    map.appendChild(pin);
  });

  const legend = map.querySelector(".map-legend");
  if(legend && !legend.querySelector(".live-count")){
    const note = document.createElement("div");
    note.className = "legend-row live-count";
    note.innerHTML = `<span class="legend-pin na"></span> Live: ${countries.reduce((s,c)=>s+c.count,0)} reports`;
    legend.appendChild(note);
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  const rows = await loadHomeRiskRows();
  renderHomeRiskPins(groupHomeCountries(rows));
});
