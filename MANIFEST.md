# Jooking Artists hidden/admin patch

This patch creates the Artists feature but does NOT add it to the public menu.

Files included:
- pages/artists.html
- pages/admin-artists.html
- pages/admin-data.html
- pages/setup-artists.sql
- assets/js/artists.js
- assets/js/admin-artists.js
- assets/css/artists.css

How to use:
1. Upload/replace these files in GitHub.
2. Deploy on Vercel.
3. In Supabase SQL Editor, run:
   pages/setup-artists.sql
4. Open:
   /pages/admin-artists.html
5. Add artist records with:
   - artist name
   - photo URL
   - country
   - profession
   - category
   - bio / known works
   - statement summary
   - exact quote optional
   - position type
   - source label / URL / date
   - status
6. Public preview page exists at:
   /pages/artists.html

Important:
- The page is hidden because it is not linked in the menu.
- Only records with status = approved appear publicly.
- Use factual, source-based wording only.
