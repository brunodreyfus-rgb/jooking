# AntiBooking V2.3 Admin Editor

## What this patch adds

The admin dashboard can now edit published incidents directly from the UI.

You can edit:
- place name
- category
- status: approved / under_review / archived
- country
- city
- incident date
- tourism type
- confidence
- summary
- details
- source label
- source URL

You can also:
- mark an incident under review
- archive an incident
- refresh incidents

## Install

Upload/replace:

`assets/js/admin-supabase.js`

Then commit and wait for Vercel redeploy.

## Important

Homepage V2.1 only shows incidents where:

`status = approved`

So if you archive or mark under_review, the incident disappears from the public homepage.
