create extension if not exists pgcrypto;

create table if not exists public.country_help (
  id uuid primary key default gen_random_uuid(),
  country_en text not null unique,
  country_he text not null,
  flag_emoji text,
  embassy_name_he text,
  city text,
  address text,
  phone text,
  emergency_phone text,
  consular_phone text,
  website_url text,
  maps_url text,
  local_emergency_number text,
  last_verified_at timestamptz,
  active boolean not null default true,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.travel_warnings (
  id uuid primary key default gen_random_uuid(),
  country_he text not null unique,
  level integer check (level between 1 and 4),
  recommendation_he text,
  details_url text,
  source_updated_at text,
  synced_at timestamptz not null default now(),
  raw jsonb
);

alter table public.country_help enable row level security;
alter table public.travel_warnings enable row level security;

drop policy if exists "country_help public read" on public.country_help;
create policy "country_help public read" on public.country_help for select using (active = true);

drop policy if exists "travel_warnings public read" on public.travel_warnings;
create policy "travel_warnings public read" on public.travel_warnings for select using (true);

drop policy if exists "country_help authenticated manage" on public.country_help;
create policy "country_help authenticated manage" on public.country_help for all to authenticated using (true) with check (true);

-- Starter countries from the current static Jooking dataset. Fill/verify contacts in Admin before relying on them.
insert into public.country_help (country_en,country_he,flag_emoji,active) values
  ('France','צרפת','🇫🇷',true),
  ('Spain','ספרד','🇪🇸',true),
  ('Italy','איטליה','🇮🇹',true),
  ('Mexico','מקסיקו','🇲🇽',true),
  ('Hungary','הונגריה','🇭🇺',true)
on conflict (country_en) do nothing;
