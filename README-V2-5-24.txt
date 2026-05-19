Jooking V2.5.24 - map clicks + analytics scripts

Replace/upload:
- index.html
- assets/css/map-clicks.css
- assets/js/click-tracking.js
- assets/js/home-map-click-filter.js

Keep existing files from V2.5.23.

What this adds:
- World map pins are clickable.
- Clicking a pin selects a matching country in the search filters.
- It resets city/category to All.
- It runs the existing search.
- It scrolls smoothly to the first reported place.
- Adds Vercel Web Analytics and Speed Insights scripts for static HTML.
- Adds lightweight click tracking for: View details, Comment, Report Incident, category clicks, map pin clicks, filter changes.

Note:
The existing homepage map uses region labels, not exact country names. This script maps each region pin to the first matching country available in the Country dropdown.
