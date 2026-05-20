# Jooking data restore + menu cleanup patch

This patch does two things:

1. Removes Search and Risks from the header menu in `assets/js/components.js`.
2. Restores the Admin Data Manager default table to `incidents`, so existing platform data appears again.

It also keeps `Submitted Reports` available as a tab, but it is not the default because your Supabase screenshot shows `reports` has 0 rows.

Apply at the root of the GitHub repo.
