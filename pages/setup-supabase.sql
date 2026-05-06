create extension if not exists pgcrypto;

create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  status text not null default 'pending' check (status in ('pending','needs_info','approved','rejected')),
  place_name text not null,
  category text not null,
  country text not null,
  city text not null,
  incident_date date,
  reporter_email text not null,
  evidence_link text,
  evidence_file_url text,
  description text not null,
  publication_consent text,
  moderator_notes text
);

create table if not exists public.incidents (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  approved_at timestamptz not null default now(),
  source_report_id uuid references public.reports(id) on delete set null,
  status text not null default 'approved',
  tourism_type text not null default 'tourism_direct',
  confidence text not null default 'User report - approved by admin',
  place_name text not null,
  category text not null,
  country text not null,
  city text not null,
  incident_date date,
  summary text,
  details text,
  source_label text,
  source_url text,
  evidence_file_url text
);

create table if not exists public.admin_audit_log (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  admin_email text,
  action text not null,
  report_id uuid,
  details jsonb
);

create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select coalesce(auth.jwt() ->> 'email', '') = 'bruno.dreyfus@gmail.com';
$$;

alter table public.reports enable row level security;
alter table public.incidents enable row level security;
alter table public.admin_audit_log enable row level security;

drop policy if exists "Anyone can submit reports" on public.reports;
create policy "Anyone can submit reports"
on public.reports for insert to anon, authenticated
with check (status = 'pending');

drop policy if exists "Admins can read reports" on public.reports;
create policy "Admins can read reports"
on public.reports for select to authenticated
using (public.is_admin());

drop policy if exists "Admins can update reports" on public.reports;
create policy "Admins can update reports"
on public.reports for update to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Public can read approved incidents" on public.incidents;
create policy "Public can read approved incidents"
on public.incidents for select to anon, authenticated
using (status = 'approved');

drop policy if exists "Admins can manage incidents" on public.incidents;
create policy "Admins can manage incidents"
on public.incidents for all to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Admins can read audit log" on public.admin_audit_log;
create policy "Admins can read audit log"
on public.admin_audit_log for select to authenticated
using (public.is_admin());

drop policy if exists "Admins can insert audit log" on public.admin_audit_log;
create policy "Admins can insert audit log"
on public.admin_audit_log for insert to authenticated
with check (public.is_admin());

insert into storage.buckets (id, name, public)
values ('report-evidence', 'report-evidence', true)
on conflict (id) do nothing;

drop policy if exists "Anyone can upload report evidence" on storage.objects;
create policy "Anyone can upload report evidence"
on storage.objects for insert to anon, authenticated
with check (bucket_id = 'report-evidence');

drop policy if exists "Anyone can read report evidence" on storage.objects;
create policy "Anyone can read report evidence"
on storage.objects for select to anon, authenticated
using (bucket_id = 'report-evidence');
