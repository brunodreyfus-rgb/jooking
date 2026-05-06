create table if not exists public.ai_leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  status text not null default 'new' check (status in ('new', 'imported', 'rejected', 'needs_verification')),
  source_type text not null default 'manual_ai_brief',
  place_name text,
  category text not null,
  country text not null,
  city text,
  incident_date date,
  summary text not null,
  details text,
  source_label text,
  source_url text,
  evidence_quality text,
  publish_recommendation text,
  moderator_notes text
);

alter table public.ai_leads enable row level security;

drop policy if exists "Admins can read ai leads" on public.ai_leads;
create policy "Admins can read ai leads"
on public.ai_leads for select to authenticated
using (public.is_admin());

drop policy if exists "Admins can manage ai leads" on public.ai_leads;
create policy "Admins can manage ai leads"
on public.ai_leads for all to authenticated
using (public.is_admin())
with check (public.is_admin());

insert into public.ai_leads
(status, source_type, place_name, category, country, city, incident_date, summary, details, source_label, source_url, evidence_quality, publish_recommendation)
values
('new','user_provided_lead','La Taverna di Santa Chiara','Restaurant','Italy','Naples','2025-05-01','Israeli couple reportedly asked to leave a Naples restaurant after being identified as Israeli.','Owner reportedly said Israelis were not welcome; owner reportedly claimed political argument. Verify exact date/context before public wording.','The Times','https://www.thetimes.com/world/europe/article/naples-restaurant-video-israeli-tourists-2r9mdgvp6','Media report; video referenced; verify full context','Needs verification before publication'),
('new','user_provided_lead','Pun Pun Thai Food','Restaurant','Thailand','Koh Phangan','2026-04-01','Restaurant reportedly posted a sign refusing service to Israeli tourists.','Sign reportedly cited past behavioral issues and political solidarity with Palestine. Needs corroboration.','Instagram reel','https://www.instagram.com/reel/DPGMWvjjrsz/','Visual/social evidence; needs corroboration','Needs verification before publication'),
('new','user_provided_lead','Hotels in Kyoto and Nagano','Hotel','Japan','Kyoto / Nagano','2025-01-01','Hotels reportedly asked Israeli guests to sign declarations denying involvement in war crimes.','Split into separate hotel records once names are confirmed.','Anadolu Agency','https://www.aa.com.tr/en/asia-pacific/japanese-hotel-asks-israeli-tourist-to-sign-declaration-he-did-not-commit-war-crimes/3549621','Media report; needs hotel names and exact details','Needs verification / split into separate records'),
('new','user_provided_lead','Hotels in Kyoto and Nagano','Hotel','Japan','Kyoto / Nagano','2025-12-17','Additional Japan hotel reports involving Israeli guests and war-crimes declarations.','Use together with AA report; verify hotel names before public listing.','Japan News / Yomiuri','https://japannews.yomiuri.co.jp/society/general-news/20251217-299003/','Media report; needs hotel names and exact details','Needs verification / split into separate records'),
('new','user_provided_lead','Unnamed Italian hotel','Hotel','Italy',null,'2025-01-01','Italian hotel manager reportedly rejected an Israeli couple reservation and accused Israelis of genocide.','Regional authorities reportedly condemned the refusal. Add exact hotel/city once identified.','The Hill / AP','https://thehill.com/homenews/ap/ap-business/ap-italian-hotel-manager-rejects-israeli-couples-reservation-accusing-israeli-people-of-genocide/','AP/media report; place name missing','Needs verification before publication'),
('new','user_provided_lead','Unnamed hostel','Airbnb / Rental','Bosnia',null,'2025-01-01','Traveler reportedly denied entry to a hostel because of nationality.','Needs source link, exact hostel name, city, date and evidence before publication.','User-provided lead',null,'Low until source/place confirmed','Needs verification'),
('new','user_provided_lead','Unnamed Dutch hotel','Hotel','Netherlands',null,'2023-01-01','Dutch hotel reportedly refused to refund Israelis and made hostile political remarks.','Needs exact hotel, city and full context before public listing.','Jerusalem Post','https://www.jpost.com/business-and-innovation/all-news/article-770789','Media report; hotel name/city to confirm','Needs verification before publication'),
('new','user_provided_lead','Unnamed Swiss hotel','Hotel','Switzerland',null,'2024-01-01','Swiss hotel reportedly removed an Israeli family in an alleged antisemitic incident.','Needs exact hotel, city, date and response from source article before publication.','JNS','https://www.jns.org/antisemitism/swiss-hotel-boots-israeli-family-in-alleged-antisemitic-incident','Media report; hotel name/city to confirm','Needs verification before publication');
