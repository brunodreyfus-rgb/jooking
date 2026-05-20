# Jooking static HTML patch

This patch targets the real static site structure: `.html` pages and `/assets/js`, `/assets/css` files.

Changed/new files:
- index.html: loads shared map coordinates before the homepage map renderer.
- assets/js/components.js: Search and Risks now point to real static pages.
- pages/search.html: new static Search landing page.
- pages/risks.html: new static Risks landing page.
- assets/js/risk-map-shared.js: one lon/lat based coordinate source of truth for maps.
- assets/js/home-risk-map.js: homepage map uses the shared coordinates.
- assets/css/map-clicks.css: forces correct map scaling and moves home legend bottom-left.
- assets/css/country-risk.css: full-world Risk Map visibility and legend bottom-left.
- pages/country-risk.html: “Supabase live dashboard” changed to “Live dashboard”.
- pages/methodology.html: adds submitter anonymity guarantee.
- pages/report.html: Jooking branding, common CSS, removes V2 technical text, adds anonymity text.
- assets/js/reported-events-import.js: helper to detect reported events not already added.

Apply at the repository root with:

```bash
unzip -o jooking-static-html-real-patch.zip -d .
```

Then deploy to Vercel.
