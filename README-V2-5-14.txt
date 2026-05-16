Jooking V2.5.14 - Real transparent logo + report submit fix

Upload / replace:
- assets/img/jooking-logo-transparent.png
- assets/img/logo-header.png
- assets/img/jooking-logo-preview-on-header-gray.png
- assets/js/components.js
- assets/css/jooking-brand.css
- assets/js/report.js
- assets/js/admin-data.js
- pages/admin-data.html

Supabase SQL:
- Run pages/setup-public-report-submit-v2-5-14.sql

Important:
- The report form now inserts public submissions into table public.reports.
- Admin now has a new tab: Submitted Reports.
- In Admin, open Submitted Reports, correct fields, then click Approve -> Incident.
- The logo files are true transparent PNGs, not checkerboard background screenshots.

If the report page does not currently load report.js:
Add before </body> in pages/report.html:
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script src="/assets/js/supabase-config.js"></script>
<script src="/assets/js/supabase-client.js"></script>
<script src="/assets/js/report.js"></script>
