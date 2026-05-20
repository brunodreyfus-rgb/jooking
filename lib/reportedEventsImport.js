function normalizeKey(value) {
  return String(value || '').trim().toLowerCase();
}

export function eventFingerprint(event) {
  return [
    normalizeKey(event.id || event.reportId || event.reference),
    normalizeKey(event.date || event.createdAt || event.reportedAt),
    normalizeKey(event.city),
    normalizeKey(event.country),
    normalizeKey(event.category || event.type),
    normalizeKey(event.description || event.summary),
  ].join('|');
}

export function findMissingReportedEvents(reportedEvents = [], existingPlatformEvents = []) {
  const existingKeys = new Set(existingPlatformEvents.map(eventFingerprint));
  return reportedEvents.filter((event) => !existingKeys.has(eventFingerprint(event)));
}

export function buildImportPayload(reportedEvents = [], existingPlatformEvents = []) {
  const missing = findMissingReportedEvents(reportedEvents, existingPlatformEvents);
  return {
    totalReported: reportedEvents.length,
    alreadyInPlatform: reportedEvents.length - missing.length,
    missingCount: missing.length,
    eventsToImport: missing,
  };
}
