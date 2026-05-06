# AntiBooking V2.2 Direct Approved Cases

This patch contains one SQL file:

`pages/insert-approved-cases-v2-2.sql`

## Install

1. Supabase > SQL Editor > New query
2. Paste the full SQL file
3. Click Run
4. Go to the public homepage
5. The cases should appear because V2.1 reads approved incidents live from Supabase

## Notes

Some records are intentionally named `Unnamed hotel` or `Unnamed hostel`.
Update them later in Supabase when you identify exact property names and cities.
