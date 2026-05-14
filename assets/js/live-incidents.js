/* AntiBooking V2.5.6 - Supabase-only public incidents */

function mapSupabaseIncident(row) {
  return {
    id: row.id,
    status: row.status || "approved",
    name: row.place_name || row.name || "Unnamed place",
    category: row.category || "Other",
    country: row.country || "Unknown",
    city: row.city || "Unknown",
    date: row.incident_date || row.date || null,
    summary: row.summary || "",
    details: row.details || row.summary || "",
    confidence: row.confidence || "Approved report",
    tourism_type: row.tourism_type || "",
    sources: [{ label: row.source_label || "Source", url: row.source_url || "#" }]
  };
}

async function getPublicIncidents() {
  if (!window.antibookingSupabase) {
    console.error("Supabase client not found: antibookingSupabase is missing.");
    return [];
  }

  const { data, error } = await window.antibookingSupabase
    .from("incidents")
    .select("*")
    .eq("status", "approved")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Could not load approved incidents from Supabase:", error);
    return [];
  }

  const rows = Array.isArray(data) ? data : [];
  console.info(`AntiBooking Supabase approved incidents loaded: ${rows.length}`);
  return rows.map(mapSupabaseIncident);
}
