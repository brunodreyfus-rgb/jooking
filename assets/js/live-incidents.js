/* AntiBooking V2.5.8 - Robust Supabase-only public incidents */

function getAntiBookingSupabaseClient() {
  if (window.antibookingSupabase) return window.antibookingSupabase;
  if (window.supabaseClient) return window.supabaseClient;
  if (window.supabase && typeof window.supabase.from === "function") return window.supabase;

  try {
    if (typeof antibookingSupabase !== "undefined") return antibookingSupabase;
  } catch (e) {}

  try {
    if (typeof supabaseClient !== "undefined") return supabaseClient;
  } catch (e) {}

  console.error("AntiBooking: Supabase client not found.");
  return null;
}

function mapSupabaseIncident(row) {
  return {
    id: row.id,
    status: row.status || "approved",
    name: row.place_name || row.name || row.business_name || "Unnamed place",
    category: row.category || "Other",
    country: row.country || "Unknown",
    city: row.city || "Unknown",
    date: row.incident_date || row.date || row.created_at || null,
    summary: row.summary || row.short_summary || "",
    details: row.details || row.description || row.summary || "",
    confidence: row.confidence || row.evidence_quality || "Approved report",
    tourism_type: row.tourism_type || "",
    sources: [
      {
        label: row.source_label || row.source || "Source",
        url: row.source_url || row.url || "#"
      }
    ]
  };
}

async function getPublicIncidents() {
  const client = getAntiBookingSupabaseClient();

  if (!client) {
    console.error("AntiBooking: cannot load incidents because Supabase client is missing.");
    return [];
  }

  const { data, error } = await client
    .from("incidents")
    .select("*")
    .eq("status", "approved");

  if (error) {
    console.error("AntiBooking: could not load approved incidents from Supabase.", error);
    return [];
  }

  const rows = Array.isArray(data) ? data : [];

  rows.sort((a, b) => {
    const da = new Date(a.created_at || a.incident_date || 0).getTime();
    const db = new Date(b.created_at || b.incident_date || 0).getTime();
    return db - da;
  });

  console.info(`AntiBooking: loaded ${rows.length} approved incidents from Supabase.`);

  return rows.map(mapSupabaseIncident);
}
