function normalize(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ');
}

export function buildReportedEventKey(event) {
  if (event?.id) return `id:${event.id}`;

  const date = normalize(event?.date || event?.created_at || event?.reportedAt);
  const location = normalize(event?.location || event?.city || event?.country);
  const type = normalize(event?.riskType || event?.risk_type || event?.category);
  const description = normalize(event?.description || event?.details || event?.summary).slice(0, 160);

  return [date, location, type, description].join('|');
}

export function filterNewReportedEvents(reportedEvents = [], existingEvents = []) {
  const existingKeys = new Set(existingEvents.map(buildReportedEventKey));
  const seenInBatch = new Set();

  return reportedEvents.filter((event) => {
    const key = buildReportedEventKey(event);
    if (!key || existingKeys.has(key) || seenInBatch.has(key)) return false;
    seenInBatch.add(key);
    return true;
  });
}

export function summarizeImport(reportedEvents = [], existingEvents = []) {
  const newEvents = filterNewReportedEvents(reportedEvents, existingEvents);
  return {
    received: reportedEvents.length,
    alreadyInPlatform: reportedEvents.length - newEvents.length,
    readyToImport: newEvents.length,
    events: newEvents,
  };
}
