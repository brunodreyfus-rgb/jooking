# AntiBooking V2.1 Live Incidents Patch

This patch makes the public homepage and Country Risk Dashboard read approved incidents from Supabase.

## Files included

- `index.html`
- `pages/country-risk.html`
- `assets/js/live-incidents.js`
- `assets/js/search.js`
- `assets/js/risk.js`

## What changes

- Public homepage loads `incidents` from Supabase where `status = approved`
- Fictional demo seed data is hidden from public search
- Starter real-source cases remain visible as seed content
- Country Risk Dashboard uses approved Supabase incidents + starter real cases
- If Supabase is empty, the site still shows starter real-source cases

## Before uploading

Make sure V2 is already installed:
- `assets/js/supabase-config.js` has your real Supabase URL and publishable key
- `reports` and `incidents` tables exist
- Admin approval inserts into `incidents`

## Test

1. Submit a report from `/pages/report.html`
2. Login at `/pages/admin.html`
3. Approve the report
4. Go to homepage
5. The approved report should appear live
