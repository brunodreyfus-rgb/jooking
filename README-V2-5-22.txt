Jooking V2.5.22 - remove Risk Signal and yellow/red badges

Upload:
- assets/css/reported-places-cleanup.css

Then add this line in index.html after compact-layout-fix.css:

<link rel="stylesheet" href="/assets/css/reported-places-cleanup.css" />

This patch:
- hides Risk signal text, score, bars, and confidence line
- keeps View details and Comment buttons
- hides yellow/red report-status badges such as Media Report / Approved Report / Needs Verification
- keeps blue category badge and green Approved badge
- makes cards more compact
