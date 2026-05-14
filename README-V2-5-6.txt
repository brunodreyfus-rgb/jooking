AntiBooking V2.5.6 - Supabase-only data

Upload / replace:
- assets/js/live-incidents.js
- assets/js/friendly.js
- assets/css/friendly-supabase-empty.css

Add this to pages/friendly.html if not already loaded:
<link rel="stylesheet" href="/assets/css/friendly-supabase-empty.css"/>

Run in Supabase SQL Editor to verify counts:
- pages/supabase-count-check.sql

Expected:
- If Supabase has 20 approved incidents, the site should show 20 reports.
- If Supabase has 0 approved friendly places, Friendly page should show 0.
