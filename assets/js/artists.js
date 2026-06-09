/* Jooking Artists public page - hidden until linked in menu */
let publicArtists = [];

function getJookingClient() {
  if (window.antibookingSupabase) return window.antibookingSupabase;
  if (window.supabaseClient) return window.supabaseClient;
  try { if (typeof antibookingSupabase !== "undefined") return antibookingSupabase; } catch (e) {}
  return null;
}

function safeHtml(value) {
  return String(value || "").replace(/[<>&"]/g, c => ({ "<":"&lt;", ">":"&gt;", "&":"&amp;", '"':"&quot;" }[c]));
}

function safeAttr(value) {
  return safeHtml(value).replace(/'/g, "&#39;");
}

function artistPhoto(row) {
  return row.photo_url || "/assets/img/jooking-placeholder.svg";
}

async function loadArtists() {
  const grid = document.getElementById("artistsGrid");
  const count = document.getElementById("artistsCount");
  const client = getJookingClient();

  if (!grid || !count) return;
  grid.innerHTML = '<div class="artist-card"><h3>Loading...</h3></div>';

  if (!client) {
    grid.innerHTML = "";
    count.textContent = "Supabase client not found.";
    return;
  }

  const { data, error } = await client
    .from("artists")
    .select("*")
    .eq("status", "approved")
    .order("created_at", { ascending: false })
    .range(0, 999);

  if (error) {
    console.error("Could not load artists.", error);
    grid.innerHTML = "";
    count.textContent = "Artists table not ready yet.";
    document.getElementById("artistsEmpty").style.display = "block";
    return;
  }

  publicArtists = Array.isArray(data) ? data : [];
  renderArtists();
}

function renderArtists() {
  const grid = document.getElementById("artistsGrid");
  const empty = document.getElementById("artistsEmpty");
  const count = document.getElementById("artistsCount");
  const q = String(document.getElementById("artistSearch")?.value || "").toLowerCase().trim();
  const position = document.getElementById("artistPositionFilter")?.value || "all";

  const rows = publicArtists.filter(row => {
    if (position !== "all" && row.position_type !== position) return false;
    if (!q) return true;
    return JSON.stringify(row).toLowerCase().includes(q);
  });

  count.textContent = `${rows.length} published artist record${rows.length === 1 ? "" : "s"}.`;
  empty.style.display = rows.length ? "none" : "block";

  grid.innerHTML = rows.map(row => {
    const source = row.source_url
      ? `<a href="${safeAttr(row.source_url)}" target="_blank" rel="noopener noreferrer">${safeHtml(row.source_label || "Source")}</a>`
      : safeHtml(row.source_label || "Source needed");

    return `
      <article class="artist-card">
        <div class="artist-photo">
          <img src="${safeAttr(artistPhoto(row))}" alt="${safeAttr(row.artist_name || "Artist")}" loading="lazy"/>
        </div>
        <div class="artist-content">
          <div class="artist-tags">
            <span>${safeHtml(row.position_type || "Position")}</span>
            <span>${safeHtml(row.country || "Country unknown")}</span>
            <span>${safeHtml(row.profession || "Artist")}</span>
          </div>
          <h3>${safeHtml(row.artist_name || "Unnamed artist")}</h3>
          <p class="artist-bio">${safeHtml(row.bio || "")}</p>
          <div class="artist-statement">
            <strong>Public statement / action</strong>
            <p>${safeHtml(row.statement_summary || "")}</p>
          </div>
          ${row.exact_quote ? `<blockquote>${safeHtml(row.exact_quote)}</blockquote>` : ""}
          <div class="artist-source">
            <strong>Source:</strong> ${source}
            ${row.source_date ? `<span> · ${safeHtml(row.source_date)}</span>` : ""}
          </div>
        </div>
      </article>`;
  }).join("");
}

document.addEventListener("DOMContentLoaded", () => {
  loadArtists();
  document.getElementById("artistSearch")?.addEventListener("input", renderArtists);
  document.getElementById("artistPositionFilter")?.addEventListener("change", renderArtists);
});
