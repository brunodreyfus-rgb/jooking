/* AntiBooking / Jooking - Robust Supabase public incidents */

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

  console.error("Jooking: Supabase client not found.");
  return null;
}

function isPublicIncidentStatus(status) {
  const value = String(status || "").trim().toLowerCase();
  return [
    "approved",
    "validated",
    "valid",
    "published",
    "live",
    "active"
  ].includes(value);
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
    console.error("Jooking: cannot load incidents because Supabase client is missing.");
    return [];
  }

  const { data, error } = await client
    .from("incidents")
    .select("*")
    .or("status.eq.approved,status.eq.Approved,status.eq.APPROVED,status.eq.validated,status.eq.Validated,status.eq.VALIDATED,status.eq.published,status.eq.Published,status.eq.PUBLISHED,status.eq.live,status.eq.Live,status.eq.active,status.eq.Active")
    .order("created_at", { ascending: false })
    .range(0, 999);

  if (error) {
    console.error("Jooking: could not load public incidents from Supabase.", error);
    return [];
  }

  const rows = Array.isArray(data) ? data : [];
  const publicRows = rows.filter(row => isPublicIncidentStatus(row.status));

  publicRows.sort((a, b) => {
    const da = new Date(a.created_at || a.incident_date || 0).getTime();
    const db = new Date(b.created_at || b.incident_date || 0).getTime();
    return db - da;
  });

  console.info(`Jooking: loaded ${publicRows.length} public incidents from Supabase.`);

  return publicRows.map(mapSupabaseIncident);
}
