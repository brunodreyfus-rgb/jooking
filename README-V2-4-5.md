# AntiBooking V2.4.5 - Header balance + restaurant icon + Norway AI Lead

## Files to upload / replace

- `assets/css/header-fix.css`
- `assets/img/categories/restaurant.svg`
- `pages/add-norway-hotel-lunheim-ai-lead.sql`

## What changes

- Keeps the current big logo you like.
- Rebalances the menu so it is less disproportionate against the logo.
- Makes nav text slightly larger and better spaced.
- Replaces the restaurant icon with a clean fork/knife icon.
- Adds Norway / Geiranger / Hotel Lunheim as an AI Lead needing verification.

## Supabase

Run this SQL file:

`pages/add-norway-hotel-lunheim-ai-lead.sql`

This adds the case to `ai_leads`, not public `incidents`, because it needs verification.
