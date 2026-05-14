AntiBooking V2.5.10 - Fix map, Friendly Finland, Admin Data link

Upload / replace:
- assets/js/components.js
- assets/js/country-risk.js
- assets/css/country-risk.css
- pages/admin-data.html
- assets/css/admin-data.css
- assets/js/admin-data.js

Supabase:
1. Run pages/fix-friendly-schema-and-seed-v2-5-10.sql
2. Open pages/admin-crud-policies-v2-5-10.sql
3. Replace YOUR_ADMIN_EMAIL_HERE with your Supabase login email
4. Run it

After deploy:
- Friendly Places should show Finland entries.
- Risk Map should stop loading and show country dashboard.
- Admin Data should appear in the header menu.
- Open /pages/admin-data.html after logging in via /pages/admin.html.
