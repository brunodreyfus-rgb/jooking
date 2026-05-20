# Jooking / AntiBooking V1 patch package

This zip contains updated/new files for the latest requested fixes:

- Fixed Home and Risk Map point projection alignment using a shared map component.
- Added Search and Risks pages so menu links no longer redirect to Home.
- Updated Risk Map wording from “Supabase live dashboard” to “Live dashboard”.
- Added anonymity guarantee wording to Methodology.
- Cleaned Report Incident page: grey background, correct Jooking logo references, removed obsolete V2 Supabase text.
- Added `lib/reportedEventsImport.js` helper to identify reported events that are not already in the platform before import.

## How to apply

Copy these files into your Next.js project, preserving paths.

If you already have equivalent files, compare and merge manually:

```txt
components/JookingWorldMap.js
components/Layout.js
lib/reportedEventsImport.js
pages/index.js
pages/risk-map.js
pages/search.js
pages/risks.js
pages/methodology.js
pages/report-incident.js
styles/globals.css
```

## Notes

The map component expects incidents with this shape:

```js
{
  id: 'unique-id',
  title: 'Incident title',
  country: 'France',
  lat: 46.2276,
  lng: 2.2137,
  severity: 'high' // low | medium | high | critical
}
```

The import helper deduplicates by normalized `externalId`, `bookingReference`, or a fallback fingerprint made from title/country/date.
