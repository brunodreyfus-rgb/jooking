AntiBooking V2.5.12 - Admin filters + audit known cases

Upload / replace:
- pages/admin-data.html
- assets/css/admin-data.css
- assets/js/admin-data.js

Run in Supabase SQL Editor:
- pages/audit-known-cases-v2-5-12.sql
- pages/missing-data-audit-v2-5-12.sql

Adds admin filters:
- status
- category
- country
- missing city
- missing date
- missing URL
- missing details
- missing source label

Workflow:
1. AI scan creates rows in ai_leads.
2. Open Admin > AI Leads.
3. Filter needs_verification or missing URL/date/city.
4. Correct the lead.
5. Click Approve lead → Incident.
6. Site public updates from incidents.
