-- ==============================================================================
-- ABDULLAH ADEL PORTFOLIO — SUPABASE PRODUCTION SCHEMA (WITH DYNAMIC SETTINGS)
-- Run in Supabase: SQL Editor > New query > paste > Run
-- ==============================================================================

create extension if not exists pgcrypto;

-- 1) Admins Table: Only authenticated users explicitly added here have admin rights
create table if not exists public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'superadmin',
  created_at timestamptz not null default now()
);

-- 2) Projects Table: Unified schema with dynamic custom_links support
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text unique check (slug ~ '^[a-z0-9-]+$'),
  title text not null check (char_length(title) between 1 and 150),
  subtitle text check (subtitle is null or char_length(subtitle) <= 200),
  category text not null check (category in ('fullstack', 'aipipeline', 'desktop', 'embedded', 'soon', 'other')),
  year text check (year is null or char_length(year) <= 20),
  status text not null default 'Complete' check (status in ('Active', 'Published', 'Complete', 'In Progress')),
  rank integer check (rank is null or rank > 0),
  is_featured boolean not null default false,
  description text check (description is null or char_length(description) <= 3000),
  highlights text[] not null default '{}' check (cardinality(highlights) <= 10),
  details text check (details is null or char_length(details) <= 10000),
  tech text[] not null default '{}' check (cardinality(tech) <= 25),
  github_url text check (github_url is null or github_url ~* '^https?://[^\s]+$'),
  demo_url text check (demo_url is null or demo_url ~* '^https?://[^\s]+$'),
  video_url text check (video_url is null or video_url ~* '^https?://[^\s]+$'),
  tech_sheet_url text check (tech_sheet_url is null or tech_sheet_url ~* '^(https?://|/)[^\s]+$'),
  custom_links jsonb not null default '[]'::jsonb,
  image_path text,
  gallery text[] not null default '{}' check (cardinality(gallery) <= 15),
  views_count integer not null default 0,
  sort_order integer not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 3) Site Settings Table: Global dynamic links, profile, bio and options
create table if not exists public.site_settings (
  id text primary key default 'global',
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- 4) Site Metrics Table: Atomic counters for CV downloads and global stats
create table if not exists public.site_metrics (
  key text primary key,
  value bigint not null default 0,
  updated_at timestamptz not null default now()
);

insert into public.site_metrics (key, value)
values ('cv_downloads', 0)
on conflict (key) do nothing;

-- 5) Contact Inquiries Table: Direct messages from visitors
create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 100),
  email text not null check (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  message text not null check (char_length(message) between 10 and 4000),
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

-- 6) Performance Indexes
create index if not exists idx_projects_display on public.projects (published, is_featured, rank, sort_order);
create index if not exists idx_projects_category on public.projects (category);
create index if not exists idx_projects_slug on public.projects (slug);
create index if not exists idx_projects_tech on public.projects using gin(tech);

-- 7) Automatic updated_at triggers
create or replace function public.set_updated_at() returns trigger
language plpgsql set search_path = public as $$
begin 
  new.updated_at = now(); 
  return new; 
end $$;

drop trigger if exists projects_updated_at on public.projects;
create trigger projects_updated_at before update on public.projects
for each row execute function public.set_updated_at();

drop trigger if exists site_settings_updated_at on public.site_settings;
create trigger site_settings_updated_at before update on public.site_settings
for each row execute function public.set_updated_at();

-- 8) Stored Procedures / RPC Functions
create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.admins where user_id = (select auth.uid()));
$$;
revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

create or replace function public.increment_cv_download() returns bigint
language plpgsql security definer set search_path = public as $$
declare
  new_count bigint;
begin
  insert into public.site_metrics (key, value, updated_at)
  values ('cv_downloads', 1, now())
  on conflict (key) do update 
  set value = public.site_metrics.value + 1, updated_at = now()
  returning value into new_count;
  return new_count;
end $$;
grant execute on function public.increment_cv_download() to anon, authenticated;

create or replace function public.increment_project_views(proj_id uuid) returns void
language plpgsql security definer set search_path = public as $$
begin
  update public.projects
  set views_count = views_count + 1
  where id = proj_id;
end $$;
grant execute on function public.increment_project_views(uuid) to anon, authenticated;

-- 9) Row Level Security (RLS)
alter table public.admins        enable row level security;
alter table public.admins        force  row level security;
alter table public.projects      enable row level security;
alter table public.projects      force  row level security;
alter table public.site_settings enable row level security;
alter table public.site_settings force  row level security;
alter table public.site_metrics  enable row level security;
alter table public.site_metrics  force  row level security;
alter table public.inquiries     enable row level security;
alter table public.inquiries     force  row level security;

-- Base Grants
grant select on public.projects to anon, authenticated;
grant insert, update, delete on public.projects to authenticated;
grant select on public.site_settings to anon, authenticated;
grant insert, update, delete on public.site_settings to authenticated;
grant select on public.site_metrics to anon, authenticated;
grant insert on public.inquiries to anon, authenticated;
grant select, update, delete on public.inquiries to authenticated;
grant select on public.admins to authenticated;

-- Projects RLS Policies
drop policy if exists "projects_public_read" on public.projects;
create policy "projects_public_read" on public.projects
  for select to anon, authenticated using (published or public.is_admin());

drop policy if exists "projects_admin_insert" on public.projects;
create policy "projects_admin_insert" on public.projects
  for insert to authenticated with check (public.is_admin());

drop policy if exists "projects_admin_update" on public.projects;
create policy "projects_admin_update" on public.projects
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "projects_admin_delete" on public.projects;
create policy "projects_admin_delete" on public.projects
  for delete to authenticated using (public.is_admin());

-- Site Settings RLS Policies
drop policy if exists "site_settings_public_read" on public.site_settings;
create policy "site_settings_public_read" on public.site_settings
  for select to anon, authenticated using (true);

drop policy if exists "site_settings_admin_manage" on public.site_settings;
create policy "site_settings_admin_manage" on public.site_settings
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Metrics & Inquiries RLS Policies
drop policy if exists "metrics_public_read" on public.site_metrics;
create policy "metrics_public_read" on public.site_metrics
  for select to anon, authenticated using (true);

drop policy if exists "inquiries_public_insert" on public.inquiries;
create policy "inquiries_public_insert" on public.inquiries
  for insert to anon, authenticated with check (true);

drop policy if exists "inquiries_admin_manage" on public.inquiries;
create policy "inquiries_admin_manage" on public.inquiries
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admins_read_own" on public.admins;
create policy "admins_read_own" on public.admins
  for select to authenticated using (user_id = (select auth.uid()));
