Jooking V2.5.26 - dynamic map all countries + hover tooltip

Replace:
- assets/js/home-risk-map.js
- assets/js/home-map-click-filter.js
- assets/css/map-clicks.css

What it does:
- Rebuilds the world map pins from Supabase approved incidents.
- Adds missing countries such as United States.
- Keeps red/orange/blue pins based on actual report count:
  red = 5+ reports
  orange = 2-4 reports
  blue = 1 report
- Hovering a pin shows Country + number of reports.
- Clicking a pin runs a country search and scrolls to the first result.
- Logs missing country coordinates in the browser console if a new country appears without coordinates.
