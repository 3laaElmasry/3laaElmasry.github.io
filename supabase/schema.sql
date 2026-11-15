-- Alaa Elmasry portfolio: content tables for the admin dashboard.
-- Run this once in the Supabase SQL Editor. It is safe to run again.
--
-- Access model: anyone can read the content (the site is public), and only
-- users listed in public.admins can change it. Signing up is not enough.

-- ---------- tables ----------

create table if not exists public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade
);

create table if not exists public.projects (
  id text primary key,
  sort_order integer not null default 0,
  featured boolean not null default false,
  published boolean not null default true,
  name text not null,
  url text not null,
  domain text not null default '',
  category jsonb not null default '{"en":"","ar":""}',
  metric jsonb,
  highlight jsonb,
  tags jsonb not null default '{"en":[],"ar":[]}',
  one_liner jsonb not null default '{"en":"","ar":""}',
  challenge jsonb,
  what_i_built jsonb not null default '{"en":"","ar":""}',
  result jsonb,
  screenshots jsonb not null default '{}',
  updated_at timestamptz not null default now()
);

create table if not exists public.skill_groups (
  id text primary key,
  sort_order integer not null default 0,
  label jsonb not null default '{"en":"","ar":""}',
  items jsonb not null default '[]'
);

create table if not exists public.socials (
  id text primary key,
  sort_order integer not null default 0,
  label text not null,
  url text not null,
  icon text not null default 'link',
  visible boolean not null default true
);

create table if not exists public.site_settings (
  key text primary key,
  value jsonb not null
);

create index if not exists projects_sort_order_idx on public.projects (sort_order);

-- ---------- row-level security ----------

alter table public.admins enable row level security;
alter table public.projects enable row level security;
alter table public.skill_groups enable row level security;
alter table public.socials enable row level security;
alter table public.site_settings enable row level security;

-- A signed-in user may see only their own admin row. The policies below
-- read this table as that user, so this is what makes the admin check work.
drop policy if exists "admins read own row" on public.admins;
create policy "admins read own row" on public.admins
  for select to authenticated
  using ((select auth.uid()) = user_id);

do $$
declare
  t text;
begin
  foreach t in array array['projects', 'skill_groups', 'socials', 'site_settings'] loop
    execute format('drop policy if exists "public read" on public.%I', t);
    execute format('create policy "public read" on public.%I for select to anon, authenticated using (true)', t);

    execute format('drop policy if exists "admin insert" on public.%I', t);
    execute format(
      'create policy "admin insert" on public.%I for insert to authenticated
         with check (exists (select 1 from public.admins a where a.user_id = (select auth.uid())))', t);

    execute format('drop policy if exists "admin update" on public.%I', t);
    execute format(
      'create policy "admin update" on public.%I for update to authenticated
         using (exists (select 1 from public.admins a where a.user_id = (select auth.uid())))
         with check (exists (select 1 from public.admins a where a.user_id = (select auth.uid())))', t);

    execute format('drop policy if exists "admin delete" on public.%I', t);
    execute format(
      'create policy "admin delete" on public.%I for delete to authenticated
         using (exists (select 1 from public.admins a where a.user_id = (select auth.uid())))', t);
  end loop;
end $$;

-- ---------- Data API grants (RLS above still decides which rows) ----------

grant usage on schema public to anon, authenticated;
grant select on public.projects, public.skill_groups, public.socials, public.site_settings to anon, authenticated;
grant insert, update, delete on public.projects, public.skill_groups, public.socials, public.site_settings to authenticated;
grant select on public.admins to authenticated;

-- ---------- storage for project screenshots ----------

insert into storage.buckets (id, name, public)
values ('project-images', 'project-images', true)
on conflict (id) do update set public = true;

drop policy if exists "admin read project images" on storage.objects;
create policy "admin read project images" on storage.objects
  for select to authenticated
  using (bucket_id = 'project-images'
    and exists (select 1 from public.admins a where a.user_id = (select auth.uid())));

drop policy if exists "admin upload project images" on storage.objects;
create policy "admin upload project images" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'project-images'
    and exists (select 1 from public.admins a where a.user_id = (select auth.uid())));

drop policy if exists "admin update project images" on storage.objects;
create policy "admin update project images" on storage.objects
  for update to authenticated
  using (bucket_id = 'project-images'
    and exists (select 1 from public.admins a where a.user_id = (select auth.uid())))
  with check (bucket_id = 'project-images'
    and exists (select 1 from public.admins a where a.user_id = (select auth.uid())));

drop policy if exists "admin delete project images" on storage.objects;
create policy "admin delete project images" on storage.objects
  for delete to authenticated
  using (bucket_id = 'project-images'
    and exists (select 1 from public.admins a where a.user_id = (select auth.uid())));

-- ---------- make the owner the admin ----------
-- Works once the user exists under Authentication > Users.
-- If you create the user later, run just this statement again.
insert into public.admins (user_id)
select id from auth.users where email = '3laaelmasry2005a@gmail.com'
on conflict (user_id) do nothing;
