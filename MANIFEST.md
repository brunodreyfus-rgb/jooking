# Patch v2 manifest - Jooking / AntiBooking V1

This package is structured so files can be copied directly into the root of the Next.js repo.

## Updated files
- `components/Layout.js` - fixes navbar links for Search and Risks, uses Jooking logo in header/footer.
- `components/JookingWorldMap.js` - shared world map with `geoNaturalEarth1().fitExtent(...)`; keeps Canada/Northern Europe visible; plots pins using `[lng, lat]`; legend moved bottom-left.
- `pages/index.js` - Home uses corrected shared map.
- `pages/risk-map.js` - Risk Map uses corrected shared map and changes label to `Live dashboard`.
- `pages/methodology.js` - adds anonymity guarantee wording.
- `pages/report-incident.js` - grey background, correct logo reference, removes obsolete V2 Supabase text.
- `styles/globals.css` - ensures global grey background.

## New files
- `pages/search.js` - real Search route so menu no longer redirects to Home.
- `pages/risks.js` - real Risks route so menu no longer redirects to Home.
- `lib/reportedEventsImport.js` - helper to find reported events not already added in the platform.

## About reported events not already in platform
Use `findReportedEventsNotYetInPlatform(reportedEvents, platformEvents)` to return only reports that are missing from the platform.
It deduplicates by `externalId`, `bookingReference`, or fallback fingerprint: title + country + date.
