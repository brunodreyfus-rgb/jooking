/* Jooking V2.8.4 - Abroad countries = union(country_help, travel_warnings)
   - shows every country covered by either table
   - country_help enriches contact information
   - travel_warnings enriches official warning level
   - warning-only countries fall back to MFA Situation Center
*/

(function(){
  const $ = id => document.getElementById(id);
  const esc = v => String(v ?? "").replace(/[&<>\"]/g, c => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"
  }[c]));

  let helpRows = [];
  let warningRows = [];
  let countryRows = [];

  function client(){
    if (window.antibookingSupabase) return window.antibookingSupabase;
    if (window.supabaseClient) return window.supabaseClient;
    try {
      if (typeof antibookingSupabase !== "undefined" && antibookingSupabase) return antibookingSupabase;
    } catch(e) {}
    return null;
  }

  function normalizeName(v){
    const s = String(v || "").trim();
    if (!s) return "";
    const aliases = {
      "USA":"United States",
      "United States of America":"United States",
      "US":"United States",
      "UK":"United Kingdom",
      "Bosnia & Herzegovina":"Bosnia and Herzegovina"
    };
    return aliases[s] || s;
  }

  function warningLabel(level){
    return ({
      1:"רמה 1 — אמצעי זהירות בסיסיים",
      2:"רמה 2 — אמצעי זהירות מוגברים",
      3:"רמה 3 — מומלץ להימנע מנסיעות שאינן חיוניות",
      4:"רמה 4 — אזהרה חמורה / יש לעזוב בהתאם להנחיות"
    })[Number(level)] || "אין רמת אזהרה זמינה";
  }

  function latestWarningByCountry(rows){
    const map = new Map();

    rows.forEach(row => {
      const key = normalizeName(row.country_en || row.country || row.country_name_en || row.country_he);
      if (!key) return;

      const current = map.get(key);
      const currentTs = current ? new Date(current.updated_at || current.synced_at || current.created_at || 0).getTime() : -1;
      const rowTs = new Date(row.updated_at || row.synced_at || row.created_at || 0).getTime();

      if (!current || rowTs >= currentTs) map.set(key, row);
    });

    return map;
  }

  function buildUnion(){
    const warnings = latestWarningByCountry(warningRows);
    const union = new Map();

    helpRows.forEach(h => {
      const key = normalizeName(h.country_en || h.country || h.country_he);
      if (!key) return;

      union.set(key, {
        key,
        country_en: h.country_en || key,
        country_he: h.country_he || "",
        flag_emoji: h.flag_emoji || "",
        help: h,
        warning: warnings.get(key) || null
      });
    });

    warnings.forEach((w, key) => {
      if (!union.has(key)) {
        union.set(key, {
          key,
          country_en: w.country_en || w.country || key,
          country_he: w.country_he || "",
          flag_emoji: w.flag_emoji || "",
          help: null,
          warning: w
        });
      } else {
        union.get(key).warning = w;
      }
    });

    countryRows = Array.from(union.values()).sort((a,b) =>
      (a.country_he || a.country_en).localeCompare((b.country_he || b.country_en), "he")
    );
  }

  function fillDropdown(){
    const sel = $("countrySelect");
    if (!sel) return;

    if (!countryRows.length){
      sel.innerHTML = '<option value="">אין מדינות זמינות</option>';
      return;
    }

    sel.innerHTML =
      '<option value="">בחרו מדינה</option>' +
      countryRows.map(r => {
        const label = `${r.flag_emoji ? r.flag_emoji + " " : ""}${r.country_he || r.country_en}`;
        return `<option value="${esc(r.key)}">${esc(label)}</option>`;
      }).join("");
  }

  function fallbackHelpCard(country){
    return {
      embassy_name_he: `סיוע קונסולרי לישראלים — ${country.country_he || country.country_en}`,
      city: "",
      address: "",
      phone: "+972-2-530-3155",
      emergency_phone: "+972-2-530-3155",
      consular_phone: "",
      local_emergency_number: "",
      website_url: "https://www.gov.il/he/departments/ministry_of_foreign_affairs/govil-landing-page",
      maps_url: "",
      last_verified_at: null
    };
  }

  function render(countryKey){
    const row = countryRows.find(r => r.key === countryKey);
    if (!row) return;

    const h = row.help || fallbackHelpCard(row);
    const w = row.warning || null;

    const warningText = w
      ? (w.recommendation_he || w.recommendation || w.description_he || w.description || "אזהרת מסע רשמית זמינה למדינה זו.")
      : "לא נמצאה כרגע אזהרת מל״ל למדינה זו במאגר המסונכרן.";

    const warningUrl =
      w?.details_url ||
      w?.source_url ||
      "https://www.gov.il/he/departments/dynamiccollectors/travel-warnings-nsc?skip=0";

    $("helpContent").innerHTML = `
      <div class="help-grid">

        <section class="help-card help-warning level-${w?.level || 0}">
          <h2>אזהרת מסע רשמית</h2>
          <div class="warning-level">${esc(warningLabel(w?.level))}</div>
          <p>${esc(warningText)}</p>

          <div class="help-actions">
            <a class="primary" href="${esc(warningUrl)}" target="_blank" rel="noopener">
              הנחיות רשמיות
            </a>
          </div>

          <div class="source-note">
            מקור: המטה לביטחון לאומי / data.gov.il
            ${w?.synced_at ? ` · סנכרון אחרון: ${esc(new Date(w.synced_at).toLocaleString("he-IL"))}` : ""}
          </div>
        </section>

        <section class="help-card">
          <h2>${esc(row.flag_emoji || "")} ${esc(h.embassy_name_he || ("נציגות ישראל — " + (row.country_he || row.country_en)))}</h2>

          ${row.help ? `
            <dl class="help-kv">
              <dt>עיר</dt><dd>${esc(h.city || "—")}</dd>
              <dt>כתובת</dt><dd>${esc(h.address || "—")}</dd>
              <dt>טלפון</dt><dd><span class="phone-ltr" dir="ltr">${esc(h.phone || "—")}</span></dd>
              <dt>חירום</dt><dd><span class="phone-ltr" dir="ltr">${esc(h.emergency_phone || "—")}</span></dd>
              <dt>קונסולרי</dt><dd><span class="phone-ltr" dir="ltr">${esc(h.consular_phone || "—")}</span></dd>
              <dt>חירום מקומי</dt><dd><span class="phone-ltr" dir="ltr">${esc(h.local_emergency_number || "—")}</span></dd>
            </dl>
          ` : `
            <p>
              פרטי הנציגות המקומית טרם הוזנו ל-Jooking עבור מדינה זו.
              במקרה הצורך, ניתן לפנות למרכז המצב של משרד החוץ בישראל.
            </p>
          `}

          <div class="help-actions">
            ${h.emergency_phone ? `
              <a class="danger phone-ltr" dir="ltr"
                 href="tel:${esc(String(h.emergency_phone).replace(/[^+\d]/g,""))}">
                התקשרו למספר חירום
              </a>
            ` : ""}

            ${h.phone && h.phone !== h.emergency_phone ? `
              <a class="phone-ltr" dir="ltr"
                 href="tel:${esc(String(h.phone).replace(/[^+\d]/g,""))}">
                טלפון הנציגות
              </a>
            ` : ""}

            ${h.website_url ? `
              <a class="primary" href="${esc(h.website_url)}" target="_blank" rel="noopener">
                אתר רשמי
              </a>
            ` : ""}

            ${h.maps_url ? `
              <a href="${esc(h.maps_url)}" target="_blank" rel="noopener">
                ניווט
              </a>
            ` : ""}
          </div>

          <div class="source-note">
            ${row.help
              ? `עודכן/אומת: ${esc(h.last_verified_at ? new Date(h.last_verified_at).toLocaleDateString("he-IL") : "טרם אומת")}`
              : "Fallback: מרכז המצב של משרד החוץ בישראל"}
          </div>
        </section>

      </div>`;
  }

  async function load(){
    const c = client();

    if (!c){
      $("countrySelect").innerHTML = '<option value="">לא ניתן לטעון מדינות</option>';
      $("helpContent").innerHTML = '<div class="help-card help-empty">לא ניתן להתחבר למאגר כרגע.</div>';
      return;
    }

    $("countrySelect").innerHTML = '<option value="">טוען מדינות…</option>';

    const [{data:h,error:he},{data:w,error:we}] = await Promise.all([
      c.from("country_help").select("*").eq("active", true),
      c.from("travel_warnings").select("*")
    ]);

    if (he){
      console.error("Jooking Abroad country_help error", he);
      $("countrySelect").innerHTML = '<option value="">שגיאה בטעינת המדינות</option>';
      return;
    }

    if (we) console.warn("Jooking Abroad travel_warnings error", we);

    helpRows = h || [];
    warningRows = w || [];

    buildUnion();
    fillDropdown();

    const qs = new URLSearchParams(location.search).get("country");
    const initial = countryRows.find(r => r.key === qs) || countryRows[0];

    if (initial){
      $("countrySelect").value = initial.key;
      render(initial.key);
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    $("countrySelect")?.addEventListener("change", e => render(e.target.value));
    $("countryGo")?.addEventListener("click", () => render($("countrySelect").value));
    load();
  });
})();
