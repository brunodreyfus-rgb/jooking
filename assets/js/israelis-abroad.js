/* Jooking V2.8.5 — Abroad UX / dedupe / flags
   - merges country_help + travel_warnings without duplicates
   - strips ISO codes accidentally included in official country labels
   - sorts countries naturally in Hebrew
   - derives emoji flags from ISO2 when possible
   - adds a friendly country header card
*/

(function(){
  const $ = id => document.getElementById(id);
  const esc = v => String(v ?? "").replace(/[&<>\"]/g, c => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"
  }[c]));

  let helpRows = [];
  let warningRows = [];
  let countryRows = [];

  const NAME_ALIASES = {
    "usa":"united states",
    "us":"united states",
    "u.s.":"united states",
    "u.s.a.":"united states",
    "united states of america":"united states",
    "uk":"united kingdom",
    "bosnia & herzegovina":"bosnia and herzegovina"
  };



  const ISO_BY_HE_DYNAMIC = (() => {
    const out = {};
    try {
      const dn = new Intl.DisplayNames(["he"], { type: "region" });
      for (let a = 65; a <= 90; a++) {
        for (let b = 65; b <= 90; b++) {
          const iso = String.fromCharCode(a, b);
          const name = dn.of(iso);
          if (!name || name === iso) continue;

          const normalized = String(name)
            .replace(/[\u200E\u200F\u202A-\u202E\u2066-\u2069]/g, "")
            .replace(/[״"'׳]/g, "")
            .replace(/\s+/g, " ")
            .trim();

          if (normalized) out[normalized] = iso;
        }
      }
    } catch(e) {}
    return out;
  })();

  const ISO_BY_HE = {
    "אוגנדה":"UG","אזרבייג'ן":"AZ","אזרבייג׳ן":"AZ","אוסטריה":"AT","אוסטרליה":"AU",
    "איטליה":"IT","אירלנד":"IE","איסלנד":"IS","אלבניה":"AL","אלג'יריה":"DZ","אנגליה":"GB",
    "ארצות הברית":"US","ארגנטינה":"AR","בלגיה":"BE","בולגריה":"BG","בוסניה והרצגובינה":"BA",
    "ברזיל":"BR","בריטניה":"GB","גרמניה":"DE","דנמרק":"DK","הודו":"IN","הולנד":"NL",
    "הונגריה":"HU","וייטנאם":"VN","טורקיה":"TR","יוון":"GR","יפן":"JP","ירדן":"JO",
    "ישראל":"IL","ליטא":"LT","לטביה":"LV","מקסיקו":"MX","מרוקו":"MA","נורבגיה":"NO",
    "ניו זילנד":"NZ","ספרד":"ES","פולין":"PL","פורטוגל":"PT","פינלנד":"FI","צרפת":"FR",
    "קולומביה":"CO","קנדה":"CA","קפריסין":"CY","קרואטיה":"HR","רומניה":"RO","שוודיה":"SE",
    "שווייץ":"CH","שוויץ":"CH","תאילנד":"TH","תוניסיה":"TN","דרום אפריקה":"ZA","איי הבהאמאס":"BS","בהאמה":"BS","בהאמאס":"BS","אוזבקיסטן":"UZ","איחוד האמירויות הערביות":"AE","ארצות הברית":"US","קוריאה הדרומית":"KR","דרום קוריאה":"KR","צ׳כיה":"CZ","צכיה":"CZ"
  };

  const ISO_BY_EN = {
    "afghanistan":"AF","albania":"AL","algeria":"DZ","andorra":"AD","angola":"AO","argentina":"AR",
    "armenia":"AM","australia":"AU","austria":"AT","azerbaijan":"AZ","bahamas":"BS","bahrain":"BH",
    "bangladesh":"BD","belarus":"BY","belgium":"BE","belize":"BZ","benin":"BJ","bolivia":"BO",
    "bosnia and herzegovina":"BA","botswana":"BW","brazil":"BR","bulgaria":"BG","cambodia":"KH",
    "cameroon":"CM","canada":"CA","chile":"CL","china":"CN","colombia":"CO","costa rica":"CR",
    "croatia":"HR","cyprus":"CY","czech republic":"CZ","czechia":"CZ","denmark":"DK","ecuador":"EC",
    "egypt":"EG","estonia":"EE","ethiopia":"ET","finland":"FI","france":"FR","georgia":"GE",
    "germany":"DE","ghana":"GH","greece":"GR","hungary":"HU","iceland":"IS","india":"IN",
    "indonesia":"ID","ireland":"IE","israel":"IL","italy":"IT","japan":"JP","jordan":"JO",
    "kazakhstan":"KZ","kenya":"KE","kyrgyzstan":"KG","latvia":"LV","lithuania":"LT",
    "luxembourg":"LU","malaysia":"MY","maldives":"MV","malta":"MT","mexico":"MX","moldova":"MD",
    "monaco":"MC","mongolia":"MN","montenegro":"ME","morocco":"MA","nepal":"NP","netherlands":"NL",
    "new zealand":"NZ","nigeria":"NG","north macedonia":"MK","norway":"NO","oman":"OM","pakistan":"PK",
    "panama":"PA","paraguay":"PY","peru":"PE","philippines":"PH","poland":"PL","portugal":"PT",
    "qatar":"QA","romania":"RO","rwanda":"RW","saudi arabia":"SA","senegal":"SN","serbia":"RS",
    "singapore":"SG","slovakia":"SK","slovenia":"SI","south africa":"ZA","south korea":"KR",
    "spain":"ES","sri lanka":"LK","sweden":"SE","switzerland":"CH","taiwan":"TW","tanzania":"TZ",
    "thailand":"TH","tunisia":"TN","turkey":"TR","uganda":"UG","ukraine":"UA",
    "united arab emirates":"AE","united kingdom":"GB","united states":"US","uruguay":"UY",
    "uzbekistan":"UZ","vietnam":"VN","zambia":"ZM","zimbabwe":"ZW"
  };

  function client(){
    if (window.antibookingSupabase) return window.antibookingSupabase;
    if (window.supabaseClient) return window.supabaseClient;
    try {
      if (typeof antibookingSupabase !== "undefined" && antibookingSupabase) return antibookingSupabase;
    } catch(e) {}
    return null;
  }

  function cleanLabel(v){
    let s = String(v || "")
      .replace(/[\u200E\u200F\u202A-\u202E\u2066-\u2069]/g, "")
      .replace(/\u00A0/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    s = s.replace(/^[A-Z]{2}(?:\s*[-–—:|]\s*|\s+)/u, "");
    s = s.replace(/(?:\s*[-–—:|]\s*|\s+)[A-Z]{2}$/u, "");
    s = s.replace(/^[A-Z]{2}$/u, "");
    return s.trim();
  }

  function normalizeLatin(v){
    let s = cleanLabel(v).toLowerCase().trim();
    s = NAME_ALIASES[s] || s;
    return s;
  }

  function normalizeHebrew(v){
    return cleanLabel(v)
      .replace(/[״"'׳]/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  function isoFromRow(row){
    const fields = [
      row?.country_code, row?.iso2, row?.iso_2, row?.code,
      row?.CountryCode, row?.countryCode, row?.country_iso2
    ];

    for (const field of fields){
      const s = String(field || "").trim().toUpperCase();
      if (/^[A-Z]{2}$/.test(s)) return s;
    }

    for (const value of [row?.country_he, row?.country_en, row?.country]){
      const s = String(value || "").trim();
      const prefix = s.match(/^([A-Z]{2})\s+/);
      if (prefix) return prefix[1];
      const suffix = s.match(/\s+([A-Z]{2})$/);
      if (suffix) return suffix[1];
    }

    const en = normalizeLatin(row?.country_en || row?.country || "");
    if (ISO_BY_EN[en]) return ISO_BY_EN[en];

    const he = normalizeHebrew(row?.country_he || row?.country || "");
    return ISO_BY_HE[he] || ISO_BY_HE_DYNAMIC[he] || "";
  }

  function flagFromIso(iso){
    const s = String(iso || "").toUpperCase();
    if (!/^[A-Z]{2}$/.test(s)) return "";
    return String.fromCodePoint(...[...s].map(c => 127397 + c.charCodeAt(0)));
  }

  function countryIdentity(row){
    const iso = isoFromRow(row);
    if (iso) return `iso:${iso}`;

    const en = normalizeLatin(row?.country_en || row?.country || "");
    if (en) return `en:${en}`;

    const he = normalizeHebrew(row?.country_he || "");
    if (he) return `he:${he}`;

    return "";
  }

  function warningLabel(level){
    return ({
      1:"רמה 1 — אמצעי זהירות בסיסיים",
      2:"רמה 2 — אמצעי זהירות מוגברים",
      3:"רמה 3 — מומלץ להימנע מנסיעות שאינן חיוניות",
      4:"רמה 4 — אזהרה חמורה / יש לעזוב בהתאם להנחיות"
    })[Number(level)] || "אין רמת אזהרה זמינה";
  }

  function warningTimestamp(row){
    const raw = row?.updated_at || row?.synced_at || row?.created_at || row?.last_updated || 0;
    const ts = new Date(raw).getTime();
    return Number.isFinite(ts) ? ts : 0;
  }

  function latestWarnings(rows){
    const map = new Map();

    rows.forEach(row => {
      const key = countryIdentity(row);
      if (!key) return;

      const current = map.get(key);
      if (!current || warningTimestamp(row) >= warningTimestamp(current)){
        map.set(key, row);
      }
    });

    return map;
  }

  function buildUnion(){
    const warnings = latestWarnings(warningRows);
    const union = new Map();

    helpRows.forEach(h => {
      const key = countryIdentity(h);
      if (!key) return;

      const iso = isoFromRow(h);
      union.set(key, {
        key,
        iso,
        country_en: cleanLabel(h.country_en || h.country || ""),
        country_he: cleanLabel(h.country_he || ""),
        flag_emoji: h.flag_emoji || flagFromIso(iso),
        help: h,
        warning: warnings.get(key) || null
      });
    });

    warnings.forEach((w, key) => {
      const iso = isoFromRow(w);

      if (union.has(key)){
        const item = union.get(key);
        item.warning = w;

        if (!item.country_he) item.country_he = cleanLabel(w.country_he || "");
        if (!item.country_en) item.country_en = cleanLabel(w.country_en || w.country || "");
        if (!item.flag_emoji) item.flag_emoji = flagFromIso(iso || item.iso);
        return;
      }

      union.set(key, {
        key,
        iso,
        country_en: cleanLabel(w.country_en || w.country || ""),
        country_he: cleanLabel(w.country_he || ""),
        flag_emoji: w.flag_emoji || flagFromIso(iso),
        help: null,
        warning: w
      });
    });

    /* Second-pass dedupe for sources where one row has ISO and another only a name. */
    const byDisplay = new Map();

    Array.from(union.values()).forEach(item => {
      const displayKey =
        normalizeHebrew(item.country_he) ||
        normalizeLatin(item.country_en) ||
        item.key;

      if (!byDisplay.has(displayKey)){
        byDisplay.set(displayKey, item);
        return;
      }

      const existing = byDisplay.get(displayKey);
      existing.help = existing.help || item.help;
      existing.warning =
        !existing.warning ? item.warning :
        !item.warning ? existing.warning :
        warningTimestamp(item.warning) > warningTimestamp(existing.warning) ? item.warning : existing.warning;

      existing.iso = existing.iso || item.iso;
      existing.flag_emoji = existing.flag_emoji || item.flag_emoji || flagFromIso(existing.iso);
      existing.country_en = existing.country_en || item.country_en;
      existing.country_he = existing.country_he || item.country_he;
    });

    const collator = new Intl.Collator("he", {
      usage: "sort",
      sensitivity: "base",
      ignorePunctuation: true
    });

    countryRows = Array.from(byDisplay.values()).sort((a,b) => {
      const aa = a.country_he || a.country_en || "";
      const bb = b.country_he || b.country_en || "";
      return collator.compare(aa, bb);
    });
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
        const inferredIso =
          r.iso ||
          ISO_BY_HE[normalizeHebrew(r.country_he || "")] ||
          ISO_BY_HE_DYNAMIC[normalizeHebrew(r.country_he || "")] ||
          ISO_BY_EN[normalizeLatin(r.country_en || "")] ||
          "";
        const dropdownFlag = r.flag_emoji || flagFromIso(inferredIso);
        const cleanCountryLabel = cleanLabel(r.country_he || r.country_en);
        const label = `${dropdownFlag ? dropdownFlag + " " : ""}${cleanCountryLabel}`;
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
    const countryName = cleanLabel(row.country_he || row.country_en || "");
    const inferredIso =
      row.iso ||
      ISO_BY_HE[normalizeHebrew(row.country_he || "")] ||
      ISO_BY_HE_DYNAMIC[normalizeHebrew(row.country_he || "")] ||
      ISO_BY_EN[normalizeLatin(row.country_en || "")] ||
      "";
    const flag = row.flag_emoji || flagFromIso(inferredIso) || "🏳️";

    const warningText = w
      ? (w.recommendation_he || w.recommendation || w.description_he || w.description || "אזהרת מסע רשמית זמינה למדינה זו.")
      : "לא נמצאה כרגע אזהרת מל״ל למדינה זו במאגר המסונכרן.";

    const warningUrl =
      w?.details_url ||
      w?.source_url ||
      "https://www.gov.il/he/departments/dynamiccollectors/travel-warnings-nsc?skip=0";

    $("helpContent").innerHTML = `
      <section class="country-hero-card">
        <div class="country-flag" aria-hidden="true">${esc(flag)}</div>
        <div class="country-hero-copy">
          <div class="country-eyebrow">מידע לישראלים בחו״ל</div>
          <h2>${esc(countryName)}</h2>
          <div class="country-status-row">
            <span class="country-status-pill ${w?.level ? `warning-${Number(w.level)}` : "warning-none"}">
              ${w?.level ? esc(`אזהרת מסע ${warningLabel(w.level)}`) : "אין אזהרת מסע פעילה במאגר"}
            </span>
            <span class="country-status-pill ${row.help ? "contact-ready" : "contact-fallback"}">
              ${row.help ? "פרטי נציגות זמינים" : "סיוע משרד החוץ"}
            </span>
          </div>
        </div>
      </section>

      <div class="help-grid">
        <section class="help-card help-warning level-${w?.level || 0}">
          <div class="card-heading-row">
            <div class="card-icon">⚠️</div>
            <div>
              <div class="card-kicker">בטיחות</div>
              <h2>אזהרת מסע רשמית</h2>
            </div>
          </div>

          <div class="warning-level">${esc(warningLabel(w?.level))}</div>
          <p>${esc(warningText)}</p>

          <div class="help-actions">
            <a class="primary" href="${esc(warningUrl)}" target="_blank" rel="noopener">
              צפייה בהנחיות הרשמיות
            </a>
          </div>

          <div class="source-note">
            מקור: המטה לביטחון לאומי / data.gov.il
            ${w?.synced_at ? ` · עודכן ${esc(new Date(w.synced_at).toLocaleDateString("he-IL"))}` : ""}
          </div>
        </section>

        <section class="help-card help-contact-card">
          <div class="card-heading-row">
            <div class="card-icon">🇮🇱</div>
            <div>
              <div class="card-kicker">סיוע קונסולרי</div>
              <h2>${esc(h.embassy_name_he || ("נציגות ישראל — " + countryName))}</h2>
            </div>
          </div>

          ${row.help ? `
            <div class="contact-list">
              ${h.city ? `<div class="contact-row"><span class="contact-label">עיר</span><strong>${esc(h.city)}</strong></div>` : ""}
              ${h.address ? `<div class="contact-row"><span class="contact-label">כתובת</span><strong>${esc(h.address)}</strong></div>` : ""}
              ${h.phone ? `<div class="contact-row"><span class="contact-label">טלפון</span><strong class="phone-ltr" dir="ltr">${esc(h.phone)}</strong></div>` : ""}
              ${h.emergency_phone ? `<div class="contact-row emergency-row"><span class="contact-label">חירום</span><strong class="phone-ltr" dir="ltr">${esc(h.emergency_phone)}</strong></div>` : ""}
              ${h.consular_phone ? `<div class="contact-row"><span class="contact-label">קונסולרי</span><strong class="phone-ltr" dir="ltr">${esc(h.consular_phone)}</strong></div>` : ""}
              ${h.local_emergency_number ? `<div class="contact-row"><span class="contact-label">חירום מקומי</span><strong class="phone-ltr" dir="ltr">${esc(h.local_emergency_number)}</strong></div>` : ""}
            </div>
          ` : `
            <div class="fallback-message">
              <div class="fallback-icon">ℹ️</div>
              <p>
                פרטי הנציגות המקומית טרם הוזנו ל-Jooking עבור מדינה זו.
                במקרה הצורך ניתן לפנות ישירות למרכז המצב של משרד החוץ בישראל.
              </p>
            </div>
          `}

          <div class="help-actions action-grid">
            ${h.emergency_phone ? `
              <a class="danger phone-ltr" dir="ltr"
                 href="tel:${esc(String(h.emergency_phone).replace(/[^+\d]/g,""))}">
                ☎ חירום
              </a>
            ` : ""}

            ${h.phone && h.phone !== h.emergency_phone ? `
              <a class="phone-ltr" dir="ltr"
                 href="tel:${esc(String(h.phone).replace(/[^+\d]/g,""))}">
                ☎ נציגות
              </a>
            ` : ""}

            ${h.website_url ? `
              <a class="primary" href="${esc(h.website_url)}" target="_blank" rel="noopener">
                🌐 אתר רשמי
              </a>
            ` : ""}

            ${h.maps_url ? `
              <a href="${esc(h.maps_url)}" target="_blank" rel="noopener">
                📍 ניווט
              </a>
            ` : ""}
          </div>

          <div class="source-note">
            ${row.help
              ? `פרטים אומתו: ${esc(h.last_verified_at ? new Date(h.last_verified_at).toLocaleDateString("he-IL") : "טרם אומת")}`
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
    const initial =
      countryRows.find(r => r.key === qs) ||
      countryRows.find(r => r.country_en === qs) ||
      countryRows[0];

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
