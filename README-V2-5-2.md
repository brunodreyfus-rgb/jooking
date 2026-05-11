# AntiBooking V2.5.2

Fixes:
- Friendly Places now has Country / City / Category filters like Risks.
- Friendly cards now include Details, Source and Website.
- Friendly database schema includes website/details/source fields.
- Adds Finland friendly starter dataset with websites.
- Adds CAM weekly travel leads as AI Leads for moderation.

Upload / replace:
- pages/friendly.html
- assets/css/friendly.css
- assets/js/friendly.js

Run in Supabase:
- pages/setup-friendly-places.sql
- pages/add-finland-friendly-places-v2-5-2.sql
- pages/add-cam-weekly-travel-leads-v2-5-2.sql

Important:
The CAM examples are inserted into ai_leads, not directly public incidents. After running the SQL, open Admin / AI Leads, review them, then approve/import the ones you want public.
