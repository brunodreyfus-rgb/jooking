# Jooking admin Supabase diagnostic patch

Files included:
- assets/js/components.js: removes Search and Risks from menu.
- pages/admin.html: removes the Open Admin Data Manager button.
- assets/js/supabase-config.js: restores Supabase URL/key from the uploaded repo.
- assets/js/supabase-client.js: exposes the client on window and shows clear errors.
- assets/js/admin-login.js: catches Supabase/network/login errors instead of failing silently.
- assets/js/admin-data.js: restores default table to incidents.
- pages/admin-data.html: restores admin data page structure.
- pages/supabase-test.html: new diagnostic page.

After deploy, open /pages/supabase-test.html. If it says FAILED: Failed to fetch, the issue is network/domain/Supabase project access, not the menu/admin HTML.
