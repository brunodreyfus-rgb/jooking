AntiBooking V2.5.13 - Dynamic homepage map + chat-history backfill

Upload / replace:
- assets/js/home-risk-map.js

Then add to index.html after the Supabase scripts:
<script src="/assets/js/home-risk-map.js"></script>

Run in Supabase:
- pages/chat-history-backfill-ai-leads-v2-5-13.sql

What this does:
1. Homepage map pins become live:
   - reads approved incidents from Supabase
   - groups by country
   - pin color depends on real approved report count
   - removes fake/static pins

2. Adds likely missing chat-history cases into ai_leads:
   - Vueling Valencia
   - Tsion Cafe
   - Hanoi restaurant
   - Thessaloniki restaurant area
   - Syntagma Square tourist assault
   - Milan service station
   - San Jose restaurant area
   - Museo Reina Sofia
   - Jerusalem Coffee House
   - London Luton Airport
