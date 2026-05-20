# Jooking emergency restore patch

This patch restores the Admin login/data files from the original GitHub repo you uploaded, with only one intentional UI change:

- removes `Search` and `Risks` from the menu in `assets/js/components.js`

It also reinforces `assets/js/supabase-client.js` so the Supabase client is exposed as both `window.antibookingSupabase` and `window.supabaseClient`, which helps the admin login/data pages find the same client reliably.

Files included:

- assets/js/components.js
- assets/js/admin-login.js
- assets/js/admin-data.js
- assets/js/supabase-config.js
- assets/js/supabase-client.js
- pages/admin.html
- pages/admin-data.html

Apply at the repo root, commit, deploy on Vercel, then hard refresh.
