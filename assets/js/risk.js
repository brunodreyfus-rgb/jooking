let riskSourceIncidents = [];

function normalizeType(item) {
  if (item.tourismType) return item.tourismType;
  if (item.realCase && TOURISM_DIRECT_CATEGORIES.includes(item.category)) return "tourism_direct";
  if (item.realCase) return "tourism_related";
  return "demo_seed";
}

async function buildCountryRisk() {
  riskSourceIncidents = await getRiskIncidents();

  const real = riskSourceIncidents.filter(item => item.realCase);
  const byCountry = {};

  real.forEach(item => {
    const country = item.country;
    if (!byCountry[country]) {
      byCountry[country] = {
        country,
        total: 0,
        direct: 0,
        related: 0,
        latestDate: item.date,
        examples: []
      };
    }

    const bucket = byCountry[country];
    const type = normalizeType(item);
    bucket.total += 1;
    if (type === "tourism_direct") bucket.direct += 1;
    if (type === "tourism_related") bucket.related += 1;
    if (item.date > bucket.latestDate) bucket.latestDate = item.date;
    bucket.examples.push(item);
  });

  return Object.values(byCountry).map(country => {
    const score = country.direct * 4 + country.related * 2;
    let level = "Low";
    let tagClass = "tag-green";

    if (score >= 10) {
      level = "High";
      tagClass = "tag-red";
    } else if (score >= 5) {
      level = "Medium";
      tagClass = "tag-gold";
    }

    return { ...country, score, level, tagClass };
  }).sort((a, b) => b.score - a.score || b.total - a.total);
}

async function renderCountryRisk() {
  const table = document.getElementById("riskTable");
  const cards = document.getElementById("riskCards");
  if (!table || !cards) return;

  cards.innerHTML = '<div class="panel"><h2>Loading risk dashboard...</h2></div>';
  const countries = await buildCountryRisk();

  if (!countries.length) {
    cards.innerHTML = '<div class="panel"><h2>No approved incidents yet</h2><p>Submit and approve reports from Supabase Admin to populate this dashboard.</p></div>';
    table.innerHTML = "";
    return;
  }

  cards.innerHTML = countries.slice(0, 4).map(country => `
    <article class="incident-card">
      <div class="card-body">
        <div class="tag-row">
          <span class="tag ${country.tagClass}">${country.level} risk</span>
          <span class="tag">${country.total} real leads</span>
        </div>
        <h3>${country.country}</h3>
        <p>${country.direct} direct tourism case(s), ${country.related} tourism-related context lead(s).</p>
        <div class="meta">
          <span>Score ${country.score}</span>
          <span>Latest ${formatDate(country.latestDate)}</span>
        </div>
      </div>
    </article>
  `).join("");

  table.innerHTML = `
    <div class="panel" style="overflow:auto;">
      <table style="width:100%; border-collapse:collapse;">
        <thead>
          <tr style="text-align:left; color:#64748b; font-size:12px; text-transform:uppercase; letter-spacing:.05em;">
            <th style="padding:12px; border-bottom:1px solid #e2e8f0;">Country</th>
            <th style="padding:12px; border-bottom:1px solid #e2e8f0;">Risk</th>
            <th style="padding:12px; border-bottom:1px solid #e2e8f0;">Score</th>
            <th style="padding:12px; border-bottom:1px solid #e2e8f0;">Direct</th>
            <th style="padding:12px; border-bottom:1px solid #e2e8f0;">Related</th>
            <th style="padding:12px; border-bottom:1px solid #e2e8f0;">Latest</th>
            <th style="padding:12px; border-bottom:1px solid #e2e8f0;">Example</th>
          </tr>
        </thead>
        <tbody>
          ${countries.map(country => {
            const example = country.examples[0];
            return `
              <tr>
                <td style="padding:14px 12px; border-bottom:1px solid #e2e8f0; font-weight:900;">${country.country}</td>
                <td style="padding:14px 12px; border-bottom:1px solid #e2e8f0;"><span class="tag ${country.tagClass}">${country.level}</span></td>
                <td style="padding:14px 12px; border-bottom:1px solid #e2e8f0;">${country.score}</td>
                <td style="padding:14px 12px; border-bottom:1px solid #e2e8f0;">${country.direct}</td>
                <td style="padding:14px 12px; border-bottom:1px solid #e2e8f0;">${country.related}</td>
                <td style="padding:14px 12px; border-bottom:1px solid #e2e8f0;">${formatDate(country.latestDate)}</td>
                <td style="padding:14px 12px; border-bottom:1px solid #e2e8f0;">${example ? example.name : ""}</td>
              </tr>
            `;
          }).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function formatDate(dateString) {
  if (!dateString) return "Date unknown";
  const date = new Date(dateString + "T00:00:00");
  if (Number.isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

document.addEventListener("DOMContentLoaded", renderCountryRisk);
