# Jooking v2.8.0 — Israeli Help + official travel warnings

## New / updated files only
- assets/js/components.js (updated: red Hebrew help button)
- assets/js/israelis-abroad.js (new)
- assets/css/israelis-abroad.css (new)
- pages/israelis-abroad.html (new, Hebrew/RTL)
- pages/setup-israel-help.sql (new)
- api/sync-travel-warnings.js (new)
- vercel.json (updated: daily cron at 03:00 UTC)

## One-time setup
1. Run `pages/setup-israel-help.sql` in Supabase SQL editor.
2. In Vercel Project Settings → Environment Variables add:
   - `SUPABASE_PROJECT_URL` = your real Supabase project URL, e.g. https://xxxxx.supabase.co
   - `SUPABASE_SERVICE_ROLE_KEY` = Supabase service-role key (SERVER ONLY)
   - `CRON_SECRET` = a long random secret
3. Deploy.
4. Test once by opening the Vercel function with Authorization Bearer CRON_SECRET, or wait for the daily cron.
5. Fill and verify embassy/consulate contact rows in `country_help` (the SQL seeds current static Jooking countries with names only).

## Automation
The Vercel cron runs every day at 03:00 UTC and reads the official data.gov.il Travel Warnings dataset resource:
`2a01d234-b2b0-4d46-baa0-cec05c401e7d`
Only NSC (מל״ל) rows are saved into `travel_warnings`.

## Safety
Embassy contact data is intentionally admin-managed, not auto-scraped. Phone/address changes should be verified before publication.
