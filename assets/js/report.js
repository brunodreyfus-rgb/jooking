/* Jooking V2.5.14 - Public report form submission to Supabase */

function getReportClient() {
  if (window.antibookingSupabase) return window.antibookingSupabase;
  if (window.supabaseClient) return window.supabaseClient;
  try { if (typeof antibookingSupabase !== "undefined") return antibookingSupabase; } catch(e) {}
  return null;
}

function firstValue(formData, names) {
  for (const name of names) {
    const value = formData.get(name);
    if (value !== null && String(value).trim() !== "") return String(value).trim();
  }
  return "";
}

function setReportStatus(message, ok = true) {
  let box = document.getElementById("reportStatus");
  if (!box) {
    box = document.createElement("div");
    box.id = "reportStatus";
    box.style.marginTop = "16px";
    box.style.fontWeight = "900";
    const form = document.querySelector("form");
    if (form) form.appendChild(box);
  }
  box.textContent = message;
  box.style.color = ok ? "#166534" : "#991b1b";
}

function buildReportPayload(form) {
  const fd = new FormData(form);

  const placeName = firstValue(fd, ["place_name", "business_name", "place", "business", "name", "venue"]);
  const category = firstValue(fd, ["category", "type", "tourism_type"]);
  const country = firstValue(fd, ["country"]);
  const city = firstValue(fd, ["city"]);
  const incidentDate = firstValue(fd, ["incident_date", "date"]);
  const summary = firstValue(fd, ["summary", "incident_summary", "title"]);
  const details = firstValue(fd, ["details", "description", "incident", "message"]);
  const sourceUrl = firstValue(fd, ["source_url", "url", "link", "evidence_url"]);
  const reporterEmail = firstValue(fd, ["reporter_email", "email", "contact_email"]);

  return {
    status: "needs_verification",
    place_name: placeName || "User submitted report",
    category: category || "Needs classification",
    country: country || "",
    city: city || "",
    incident_date: incidentDate || null,
    summary: summary || details.slice(0, 180) || "User submitted report",
    details: details || summary || "",
    source_label: sourceUrl ? "User submitted source" : "User submitted report",
    source_url: sourceUrl || null,
    reporter_email: reporterEmail || null
  };
}

async function submitReportToSupabase(event) {
  event.preventDefault();

  const client = getReportClient();
  if (!client) {
    setReportStatus("Could not submit: Supabase client is missing.", false);
    return;
  }

  const form = event.currentTarget;
  const payload = buildReportPayload(form);

  setReportStatus("Submitting report...", true);

  const { data, error } = await client
    .from("reports")
    .insert(payload)
    .select();

  if (error) {
    console.error("Report submit failed:", error);
    setReportStatus(`Could not submit report: ${error.message}`, false);
    return;
  }

  console.info("Report submitted:", data);
  setReportStatus("Thank you. Your report was submitted and is waiting for moderation.", true);
  form.reset();
}

document.addEventListener("DOMContentLoaded", () => {
  const form =
    document.getElementById("reportForm") ||
    document.querySelector("form[data-report-form='true']") ||
    document.querySelector("form");

  if (form) {
    form.addEventListener("submit", submitReportToSupabase);
  }
});
