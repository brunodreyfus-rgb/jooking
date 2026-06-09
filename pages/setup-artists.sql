-- Jooking Artists table
-- Run this in Supabase SQL Editor before using /pages/admin-artists.html

create table if not exists public.artists (
  id uuid primary key default gen_random_uuid(),
  status text not null default 'needs_verification',
  artist_name text not null,
  photo_url text,
  country text,
  profession text,
  category text,
  bio text,
  statement_summary text,
  exact_quote text,
  position_type text,
  source_label text,
  source_url text,
  source_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists artists_status_idx on public.artists(status);
create index if not exists artists_position_type_idx on public.artists(position_type);
create index if not exists artists_artist_name_idx on public.artists(artist_name);

alter table public.artists enable row level security;

drop policy if exists "artists public can read approved" on public.artists;
create policy "artists public can read approved"
on public.artists
for select
to anon, authenticated
using (status = 'approved');

drop policy if exists "artists authenticated can manage" on public.artists;
create policy "artists authenticated can manage"
on public.artists
for all
to authenticated
using (true)
with check (true);
