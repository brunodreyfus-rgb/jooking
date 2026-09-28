/* Jooking V2.8.4 - travel warning sync
   Keeps all official travel warning records.
   The public page groups them by country and selects the latest record.
*/

export default async function handler(req, res) {
  try {
    const auth = req.headers.authorization || "";
    const expected = `Bearer ${process.env.CRON_SECRET || ""}`;

    if (!process.env.CRON_SECRET || auth !== expected) {
      return res.status(401).json({ ok: false, error: "Unauthorized" });
    }

    const supabaseUrl = process.env.SUPABASE_PROJECT_URL;
    const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRole) {
      return res.status(500).json({ ok: false, error: "Missing Supabase server env vars" });
    }

    const source =
      "https://data.gov.il/api/3/action/datastore_search?resource_id=2a01d234-b2b0-4d46-baa0-cec05c401e7d&limit=1000";

    const response = await fetch(source, { headers: { "user-agent": "Jooking/1.0" } });

    if (!response.ok) {
      return res.status(500).json({ ok: false, error: `data.gov.il ${response.status}` });
    }

    const payload = await response.json();
    const records = payload?.result?.records || [];

    const parseLevel = value => {
      const s = String(value ?? "");
      const m = s.match(/\b([1-4])\b/);
      return m ? Number(m[1]) : null;
    };

    const textOf = (r, names) => {
      for (const name of names) {
        if (r[name] !== undefined && r[name] !== null && String(r[name]).trim() !== "") {
          return String(r[name]).trim();
        }
      }
      return "";
    };

    const rows = records.map((r, i) => {
      const countryHe = textOf(r, ["country_he","CountryHe","מדינה","שם מדינה","country"]);
      const countryEn = textOf(r, ["country_en","CountryEn","country_name_en","EnglishName","שם מדינה באנגלית"]);
      const recommendation = textOf(r, ["recommendation_he","Recommendation","המלצה","הנחיות","warning"]);
      const levelRaw = textOf(r, ["level","Level","רמה","warning_level","דרגת אזהרה"]);
      const detailsUrl = textOf(r, ["details_url","url","URL","קישור","link"]);

      return {
        source_record_id: String(r._id ?? r.id ?? i),
        country_he: countryHe || null,
        country_en: countryEn || null,
        level: parseLevel(levelRaw || recommendation),
        recommendation_he: recommendation || null,
        details_url: detailsUrl || null,
        source_name: "NSC / data.gov.il",
        raw_payload: r,
        synced_at: new Date().toISOString()
      };
    });

    const upsert = await fetch(`${supabaseUrl}/rest/v1/travel_warnings?on_conflict=source_record_id`, {
      method: "POST",
      headers: {
        apikey: serviceRole,
        Authorization: `Bearer ${serviceRole}`,
        "Content-Type": "application/json",
        Prefer: "resolution=merge-duplicates,return=minimal"
      },
      body: JSON.stringify(rows)
    });

    if (!upsert.ok) {
      const msg = await upsert.text();
      return res.status(500).json({ ok: false, error: `Supabase ${upsert.status}: ${msg}` });
    }

    return res.status(200).json({
      ok: true,
      synced: rows.length,
      source
    });

  } catch (error) {
    return res.status(500).json({
      ok: false,
      error: error?.message || String(error)
    });
  }
}
