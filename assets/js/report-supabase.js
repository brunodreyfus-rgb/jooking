async function uploadEvidenceFile(file, reporterEmail) {
  if (!file || !file.size) return null;
  const cleanName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const cleanEmail = reporterEmail.replace(/[^a-zA-Z0-9._-]/g, "_");
  const path = `${Date.now()}-${cleanEmail}-${cleanName}`;

  const { error } = await antibookingSupabase.storage
    .from("report-evidence")
    .upload(path, file, { cacheControl: "3600", upsert: false });

  if (error) throw error;

  const { data } = antibookingSupabase.storage
    .from("report-evidence")
    .getPublicUrl(path);

  return data.publicUrl;
}

async function submitReport(event) {
  event.preventDefault();
  const form = event.target;
  const status = byId("reportStatus");
  const button = byId("submitReportButton");

  status.textContent = "Submitting report...";
  button.disabled = true;

  try {
    const formData = new FormData(form);
    const reporterEmail = formData.get("reporter_email");
    const fileUrl = await uploadEvidenceFile(formData.get("evidence_file"), reporterEmail);

    const payload = {
      place_name: formData.get("place_name"),
      category: formData.get("category"),
      country: formData.get("country"),
      city: formData.get("city"),
      incident_date: formData.get("incident_date") || null,
      reporter_email: reporterEmail,
      evidence_link: formData.get("evidence_link") || null,
      evidence_file_url: fileUrl,
      description: formData.get("description"),
      publication_consent: formData.get("publication_consent"),
      status: "pending"
    };

    const { error } = await antibookingSupabase.from("reports").insert(payload);
    if (error) throw error;

    form.reset();
    status.textContent = "Thank you. Your report has been submitted for moderation.";
    status.style.color = "#15803d";
  } catch (error) {
    status.textContent = "Error submitting report: " + error.message;
    status.style.color = "#b91c1c";
  } finally {
    button.disabled = false;
  }
}

document.addEventListener("DOMContentLoaded", function() {
  const form = byId("reportForm");
  if (form) form.addEventListener("submit", submitReport);
});
