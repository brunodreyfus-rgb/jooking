let liveIncidentsLoaded = false;
let liveIncidents = [];

function mapSupabaseIncident(row) {
  return {
    id: row.id,
    realCase: true,
    tourismType: row.tourism_type || "tourism_direct",
    confidence: row.confidence || "Approved by admin",
    status: row.status || "approved",
    country: row.country,
    city: row.city,
    category: row.category,
    name: row.place_name,
    date: row.incident_date || (row.approved_at || row.created_at || "").slice(0, 10),
    summary: row.summary || row.details || "Approved AntiBooking report.",
    details: row.details || row.summary || "Approved AntiBooking report.",
    sources: [
      row.source_url
        ? { label: row.source_label || "Source / evidence", url: row.source_url }
        : { label: row.evidence_file_url ? "Uploaded evidence file" : "Approved user report", url: row.evidence_file_url || "#" }
    ]
  };
}

function staticRealIncidentsOnly() {
  if (typeof incidents === "undefined") return [];
  return incidents.filter(item => item.realCase === true && item.status !== "context_only");
}

async function loadApprovedIncidentsFromSupabase() {
  if (liveIncidentsLoaded) return liveIncidents;

  try {
    if (typeof antibookingSupabase === "undefined") {
      liveIncidentsLoaded = true;
      liveIncidents = [];
      return liveIncidents;
    }

    const { data, error } = await antibookingSupabase
      .from("incidents")
      .select("*")
      .eq("status", "approved")
      .order("approved_at", { ascending: false });

    if (error) throw error;

    liveIncidents = (data || []).map(mapSupabaseIncident);
    liveIncidentsLoaded = true;
    return liveIncidents;
  } catch (error) {
    console.error("Could not load live incidents:", error);
    liveIncidentsLoaded = true;
    liveIncidents = [];
    return liveIncidents;
  }
}

async function getPublicIncidents() {
  const approvedLive = await loadApprovedIncidentsFromSupabase();

  // V2.1 rule:
  // - show all approved Supabase incidents
  // - keep starter real-source cases as seed content
  // - remove fictional/demo seed data from public search
  const starterReal = staticRealIncidentsOnly();

  const merged = [...approvedLive];

  starterReal.forEach(item => {
    const alreadyExists = merged.some(live =>
      live.name === item.name &&
      live.country === item.country &&
      live.city === item.city
    );
    if (!alreadyExists) merged.push(item);
  });

  return merged;
}

async function getRiskIncidents() {
  const approvedLive = await loadApprovedIncidentsFromSupabase();
  const starterReal = staticRealIncidentsOnly();

  const all = [...approvedLive];
  starterReal.forEach(item => {
    const exists = all.some(live =>
      live.name === item.name &&
      live.country === item.country &&
      live.city === item.city
    );
    if (!exists) all.push(item);
  });

  return all;
}
