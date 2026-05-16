Jooking V2.5.16 - New logo filename to bypass cache

Upload / replace:
- assets/img/jooking-logo-j-black-v3.png
- assets/img/jooking-logo-transparent.png
- assets/img/logo-header.png
- assets/js/components.js

Important:
components.js now points to:
/assets/img/jooking-logo-j-black-v3.png?v=2516

Because the filename is new, Vercel/browser cache cannot reuse the old broken logo.

Also included:
- assets/img/jooking-logo-preview-v3.png
