Jooking V2.5.18 - compact responsive layout

This patch keeps the current design and adjusts only layout spacing.

Upload / replace:
- assets/css/compact-layout-fix.css
- index.html

If you do not replace index.html, add this line in <head> after jooking-logo-fix.css or footer-fix.css:

<link rel="stylesheet" href="/assets/css/compact-layout-fix.css" />

Fixes:
- Reduces gap between logo and menu.
- Keeps Report Incident inside the screen.
- Improves mobile responsive behavior.
- Pushes search panel slightly down so it does not overlap Harassment / Atmosphere.
- Reduces category icon/card size.
- Makes result cards shorter with smaller icons.
- Reduces white empty space in reported places.
- Places View details and Comment on the same line when there is enough room.
