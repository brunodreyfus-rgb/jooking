# Jooking AntiBooking V1 - Verified Patch

This package contains explicit updated/new files for the requested fixes.

## Included files

- `components/Navbar.js`
  - Fixes Search and Risks links so they no longer point to Home.

- `components/JookingLogo.js`
  - Adds reusable Jooking text logo fallback.

- `components/WorldRiskMap.js`
  - Adds responsive full-world SVG map component.
  - Keeps the legend bottom-left.
  - Uses a single coordinate projection function for both Home and Risk Map.

- `lib/mapProjection.js`
  - Centralizes latitude/longitude to SVG coordinate projection.

- `lib/reportedEventsImport.js`
  - Adds helper to compare reported events against existing platform events.
  - Returns only missing reports to import.

- `pages/search.js`
  - New Search page content.

- `pages/risks.js`
  - New Risks page content.

- `pages/risk-map.js`
  - Updates wording from “Supabase live dashboard” to “Live dashboard”.
  - Uses fixed map component.

- `pages/methodology.js`
  - Adds anonymity guarantee wording.

- `pages/report-incident.js`
  - Applies grey background.
  - Removes obsolete V2 Supabase sentence.
  - Uses Jooking logo/header/footer fallback.

- `styles/jooking-pages.css`
  - Shared page/card styling used by the new pages.

## How to apply

Copy the folders from this ZIP into the root of your Next.js project, preserving folder names.

Example:

```bash
cp -R components lib pages styles /path/to/your/repo/
```

Or from the project root after unzipping:

```bash
cp -R ./components ./lib ./pages ./styles YOUR_REPO_ROOT/
```

## Important

If your project already has these files with different component names or routes, merge manually rather than blindly overwriting.
