# Jooking admin restore + menu cleanup v2

This patch is based on the uploaded GitHub ZIP `jooking-main.zip`.

It does only these changes:

1. Removes `Search` and `Risks` from the shared header menu in `assets/js/components.js`.
2. Removes the `Open Admin Data Manager` button from `pages/admin.html`.
3. Restores the original working admin/Supabase files from the uploaded repo:
   - `assets/js/admin-login.js`
   - `assets/js/admin-data.js`
   - `assets/js/supabase-client.js`
   - `assets/js/supabase-config.js`
   - `pages/admin-data.html`

Admin data stays on the `incidents` table by default.
The `reports` table is not made default because your Supabase screenshot shows `reports = 0 rows`.

Apply at the repo root:

```bash
unzip -o jooking-admin-restore-menu-v2.zip -d .
```

Then commit and redeploy on Vercel.
