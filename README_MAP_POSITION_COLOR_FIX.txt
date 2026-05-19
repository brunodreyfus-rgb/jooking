
Replace/add:

Replace:
- assets/js/risk-map-shared.js
- assets/js/home-risk-map.js
- assets/js/country-risk.js
- pages/country-risk.html

Important in index.html:
Make sure this is present BEFORE home-risk-map.js:
<script src="/assets/js/risk-map-shared.js"></script>

Also important:
You can leave <div id="worldRiskMap"></div> in index.html, but the new home-risk-map.js no longer renders it.
That removes the extra pins around the search window.

Fixes:
- United States, Japan and Italy are forced High/red.
- United States moved to the correct North America position.
- Home and Risk Map now use the exact same coordinates.
- Risk Map now recognizes aliases like US, USA, United States of America, IT, JP.
- Europe is no longer empty if countries are present in Supabase using normal country names/aliases.

