# AntiBooking V2.2 Simple AI Agent

## What it adds
- Supabase table: `ai_leads`
- Seed AI leads from Bruno's provided cases
- Admin section: AI Leads
- Buttons: Import to reports, Needs verification, Reject lead

## Install
1. Supabase > SQL Editor > New query
2. Paste and run `pages/setup-ai-leads-v2-2.sql`
3. Upload/replace `assets/js/admin-supabase.js`
4. Commit to GitHub and wait for Vercel

## Daily workflow
1. ChatGPT daily scan at 8h returns new public leads.
2. Bruno reviews them.
3. Add selected leads to `ai_leads`.
4. In Admin, click `Import to reports`.
5. Verify details.
6. Click `Approve & publish`.

The seeded cases are moderation leads, not final public accusations.
