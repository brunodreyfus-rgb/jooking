create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  incident_id uuid not null references public.incidents(id) on delete cascade,
  author_name text not null,
  email text,
  experience_type text not null check (experience_type in ('confirmed_issue','opposite_experience','contextual_feedback')),
  comment text not null,
  status text not null default 'pending' check (status in ('pending','approved','rejected','archived')),
  moderator_notes text
);
alter table public.comments enable row level security;
drop policy if exists "Anyone can submit comments" on public.comments;
create policy "Anyone can submit comments" on public.comments for insert to anon, authenticated with check (status = 'pending');
drop policy if exists "Admins can manage comments" on public.comments;
create policy "Admins can manage comments" on public.comments for all to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists "Public can read approved comments" on public.comments;
create policy "Public can read approved comments" on public.comments for select to anon, authenticated using (status = 'approved');
