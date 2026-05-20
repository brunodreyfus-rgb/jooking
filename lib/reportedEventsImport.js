function normalize(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, ' ');
}

export function reportedEventKey(event) {
  const externalId = normalize(event.externalId || event.id || event.reportId);
  if (externalId) return `external:${externalId}`;

  const bookingReference = normalize(event.bookingReference || event.booking_ref || event.bookingId);
  if (bookingReference) return `booking:${bookingReference}`;

  const title = normalize(event.title || event.description || event.summary);
  const country = normalize(event.country || event.locationCountry);
  const date = normalize(event.date || event.reportedAt || event.created_at).slice(0, 10);
  return `fingerprint:${title}|${country}|${date}`;
}

export function findReportedEventsNotYetInPlatform(reportedEvents = [], platformEvents = []) {
  const existingKeys = new Set(platformEvents.map(reportedEventKey));
  return reportedEvents.filter((event) => !existingKeys.has(reportedEventKey(event)));
}

export function mergeNewReportedEvents(reportedEvents = [], platformEvents = []) {
  const newEvents = findReportedEventsNotYetInPlatform(reportedEvents, platformEvents);
  return {
    newEvents,
    mergedEvents: [...platformEvents, ...newEvents],
    addedCount: newEvents.length,
    skippedCount: reportedEvents.length - newEvents.length,
  };
}
