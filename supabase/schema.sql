-- Berkut v1.1 — Supabase schema, RLS policies, and OAuth bootstrap.
-- Run this once per Supabase project (dev, staging, prod).
-- Paste into the SQL editor in the Supabase dashboard.

-- ─── Extensions ──────────────────────────────────────────────────────────
create extension if not exists "uuid-ossp";

-- ─── Tables ──────────────────────────────────────────────────────────────

-- 1. user_profiles: 1:1 with auth.users — display name, avatar, script preference, gamification.
create table if not exists public.user_profiles (
  user_id        uuid primary key references auth.users(id) on delete cascade,
  display_name   text        not null check (char_length(display_name) between 2 and 30),
  avatar_url     text,
  script_pref    text        not null default 'CYRILLIC' check (script_pref in ('CYRILLIC','LATIN')),
  league         text        not null default 'BRONZE'   check (league in ('BRONZE','SILVER','GOLD','SAPPHIRE','DIAMOND')),
  xp_total       integer     not null default 0,
  xp_weekly      integer     not null default 0,
  streak_count   integer     not null default 0,
  streak_freezes integer     not null default 1,
  gems           integer     not null default 0,
  last_active_at timestamptz,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

-- 2. user_progress: snapshot of completed lessons + SRS state.
--    For MVP we store the bag of lesson + SRS data as JSONB rather than a row per item.
--    Phase 2 (§8.4.2) extracts these into normalised tables once the access patterns warrant it.
create table if not exists public.user_progress (
  user_id           uuid primary key references auth.users(id) on delete cascade,
  completed_lessons jsonb       not null default '{}'::jsonb,
  srs               jsonb       not null default '{}'::jsonb,
  badges            jsonb       not null default '{}'::jsonb,
  updated_at        timestamptz not null default now()
);

-- 3. user_xp_events: append-only audit log (90-day retention per §8.7).
create table if not exists public.user_xp_events (
  id         bigserial primary key,
  user_id    uuid    not null references auth.users(id) on delete cascade,
  amount     integer not null,
  reason     text    not null,
  created_at timestamptz not null default now()
);
create index if not exists user_xp_events_user_idx on public.user_xp_events (user_id, created_at desc);

-- ─── updated_at trigger ─────────────────────────────────────────────────
create or replace function public.set_updated_at() returns trigger
language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end; $$;

drop trigger if exists set_updated_at on public.user_profiles;
create trigger set_updated_at before update on public.user_profiles
  for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at on public.user_progress;
create trigger set_updated_at before update on public.user_progress
  for each row execute function public.set_updated_at();

-- ─── First-login profile bootstrap (§12.3.8) ─────────────────────────────
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.user_profiles (user_id, display_name, avatar_url, script_pref)
  values (
    new.id,
    coalesce(
      nullif(new.raw_user_meta_data->>'display_name', ''),
      nullif(new.raw_user_meta_data->>'full_name',    ''),
      split_part(new.email, '@', 1)
    ),
    new.raw_user_meta_data->>'picture',
    coalesce(new.raw_user_meta_data->>'script_pref', 'CYRILLIC')
  )
  on conflict (user_id) do nothing;

  insert into public.user_progress (user_id) values (new.id)
  on conflict (user_id) do nothing;

  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ─── Row-Level Security ─────────────────────────────────────────────────
alter table public.user_profiles    enable row level security;
alter table public.user_progress    enable row level security;
alter table public.user_xp_events   enable row level security;

-- user_profiles: each user reads/updates their own; everyone reads display_name + xp_weekly + league
-- (leaderboard reads via the service-role key in api/leaderboard.ts, so we restrict the user-facing
--  policy to self-access only — leaderboards will not be impacted by this).
drop policy if exists "profiles read self"   on public.user_profiles;
drop policy if exists "profiles upsert self" on public.user_profiles;
drop policy if exists "profiles update self" on public.user_profiles;

create policy "profiles read self"
  on public.user_profiles for select
  using (auth.uid() = user_id);

create policy "profiles upsert self"
  on public.user_profiles for insert
  with check (auth.uid() = user_id);

create policy "profiles update self"
  on public.user_profiles for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- user_progress
drop policy if exists "progress read self"   on public.user_progress;
drop policy if exists "progress upsert self" on public.user_progress;
drop policy if exists "progress update self" on public.user_progress;

create policy "progress read self"
  on public.user_progress for select
  using (auth.uid() = user_id);

create policy "progress upsert self"
  on public.user_progress for insert
  with check (auth.uid() = user_id);

create policy "progress update self"
  on public.user_progress for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- user_xp_events: read-only to self
drop policy if exists "xp events read self" on public.user_xp_events;
create policy "xp events read self"
  on public.user_xp_events for select
  using (auth.uid() = user_id);

-- ─── Weekly leaderboard reset job ────────────────────────────────────────
-- Phase 2 (§8.4.2) runs this from a scheduled background worker (BullMQ / Cron).
-- For MVP, run it manually or via Supabase Scheduled Functions every Sunday 00:00 UTC.
create or replace function public.reset_weekly_xp() returns void
language sql security definer as $$
  update public.user_profiles set xp_weekly = 0;
$$;
