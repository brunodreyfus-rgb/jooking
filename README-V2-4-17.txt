AntiBooking V2.4.17 - Remove remaining Bruno references

Upload / replace:
- assets/js/privacy-cleanup.js
- all included HTML files, if present

Then run in Supabase SQL Editor:
- pages/clean-bruno-references-v2-4-17.sql

Why:
The remaining "provided by Bruno" is coming from Supabase data or static source labels.
This patch fixes both:
1. SQL cleans the database.
2. privacy-cleanup.js sanitizes any remaining public display dynamically.

Suggested next improvements:
- Add a Source Quality badge and moderation checklist per incident.
- Add "Last verified" date on every report.
- Add country pages with SEO-friendly URLs.
- Add admin bulk actions: approve, reject, request info, archive.
- Add source URL validation and duplicate detection.
- Add a public "Right of reply" button on each report.
