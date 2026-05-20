# Jooking patch - menu cleanup + reports moderation queue

## Changed files

- `assets/js/components.js`
  - Removed `Search` and `Risks` from the top navigation menu.
  - Keeps `Home`, `Friendly Places`, `Risk Map`, `Methodology`, `Admin`, and the `Report Incident` CTA.

- `pages/admin-data.html`
  - Makes `Submitted Reports` the first/default admin tab.
  - Adds report statuses: `pending`, `needs_info`, `approved`, `rejected`.
  - Renames the quick filter button to `Needs review`.

- `assets/js/admin-data.js`
  - Loads the `reports` table by default so pending reviews are visible immediately.
  - Correctly maps report fields:
    - `description` -> details shown in the admin panel
    - `evidence_link` / `evidence_file_url` -> source/evidence URL
    - `pending` / `needs_info` statuses now display and save correctly
  - Approval now inserts the selected report into `incidents`, links `source_report_id`, and marks the report as `approved`.

## How to verify

1. Apply at repo root:

```bash
unzip -o jooking-menu-reports-patch.zip -d .
```

2. Deploy to Vercel.

3. Open `/pages/admin.html`, log in, then open `/pages/admin-data.html`.

4. The first tab should now be `Submitted Reports`. New reports submitted through `/pages/report.html` should appear there with status `pending`.

5. Select a report and click `Approve -> Incident` to publish it to the public incidents table.

## If Submitted Reports is still empty

That means there are no rows in the Supabase `reports` table, or the logged-in user is blocked by RLS. Check that the login email matches the `is_admin()` function in `pages/setup-supabase.sql`.
