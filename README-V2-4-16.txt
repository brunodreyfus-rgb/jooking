AntiBooking V2.4.16 - Force approved header and footer

Replace:
- index.html
- assets/css/header-fix.css
- assets/css/footer-fix.css
- assets/js/components.js
- assets/img/logo-header.png

Why this patch:
The live site is still loading an older index/layout and/or footer-fix override.
This patch makes header-fix.css and footer-fix.css both contain the approved light style, so the old dark footer/header cannot override it.
