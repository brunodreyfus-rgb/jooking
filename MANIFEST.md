# Jooking Supabase Restore Patch

Files included:
- assets/js/supabase-config.js: restores SUPABASE_URL and SUPABASE_PUBLISHABLE_KEY constants.
- assets/js/supabase-client.js: restores antibookingSupabase client creation.
- assets/js/admin-login.js: restores admin login redirect after success.
- assets/js/admin-data.js: restores incidents as default admin data table.
- assets/js/components.js: removes Search and Risks from the menu.
- pages/admin.html: removes Open Admin Data Manager button.
- pages/admin-data.html: restored from original repo.
- pages/supabase-test.html: diagnostic page.

Apply at the root of the GitHub repo, commit, deploy, then test /pages/supabase-test.html.
