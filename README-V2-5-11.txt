AntiBooking V2.5.11 - Clean menu + Friendly + Risk Map

Upload / replace:
- assets/js/components.js
- pages/friendly.html
- assets/js/friendly.js
- pages/country-risk.html
- assets/js/country-risk.js
- assets/css/friendly-supabase-empty.css

What this fixes:
- Menu shows only one Admin link, pointing to /pages/admin-data.html
- Friendly page now loads Supabase scripts before friendly.js
- Risk Map page now loads Supabase scripts before country-risk.js
- Friendly and Risk Map read live Supabase data only

Important:
If Friendly still shows 0, run the SQL that seeds Finland:
pages/fix-friendly-schema-and-seed-v2-5-10.sql
