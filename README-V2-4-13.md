# AntiBooking V2.4.13 - Remove Bruno references + grey footer

Upload / replace:
- `assets/js/components.js`
- `assets/css/footer-fix.css`
- any included `pages/*.html` / `index.html`
- any included `assets/js/*.js`

Supabase:
- Run `pages/clean-personal-references-v2-4-13.sql`

What it fixes:
- Replaces public references like "provided by Bruno" with "provided by admin".
- Cleans existing database rows containing Bruno/email references.
- Footer now uses the same grey style as the header.
- Footer keeps the same logo and "Travel informed. Stay aware."
