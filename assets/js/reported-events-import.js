/* Helper to prepare only reported events that do not already exist in the platform. */
window.JookingReportedEventsImport = {
  normalize(value){ return String(value || '').trim().toLowerCase().replace(/\s+/g,' '); },
  key(row){
    return [row.place_name || row.place || row.name, row.country, row.city, row.incident_date || row.date]
      .map(this.normalize).join('|');
  },
  findNewEvents(existingRows, incomingRows){
    const existing = new Set((existingRows || []).map(row => this.key(row)));
    return (incomingRows || []).filter(row => !existing.has(this.key(row)));
  }
};
