# Jooking v2.6.0

Built from the uploaded current repository, not from an older patch.

## Fixed
- Header menu now links to real Search, Risks, Risk Map, Methodology, Partners and Admin pages.
- Friendly Places removed from the main menu; the page remains in the repository.
- Search page now contains the live search interface instead of redirecting to Home.
- Risks page now contains actual risk-category content and links to Search and Risk Map.
- Home and Risk Map use one shared longitude/latitude projection and the same risk scoring.
- Both maps use a full uncropped world image (`background-size: 100% 100%`).
- Map legends moved to bottom-left to avoid Australia.
- Old static map pins and duplicate map renderers removed.
- Risk Map public wording no longer mentions Supabase.
- Report page uses the standard Jooking header/footer logo, gray background and data-quality guidance.
- Reporter email is optional in both HTML and submission JavaScript.
- Methodology retains the explicit anonymity guarantee.
- Vercel Analytics and Speed Insights scripts added to all HTML pages.
- Added `reports-to-review-before-import.csv` for cases not found in repository static data.

## Important limitation
The repository does not contain the current live Supabase rows. The CSV duplicate check therefore compares only against repository static data; confirm against the Admin dashboard before importing.
