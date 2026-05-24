-- Berkut v1.3 — Admin section + database-backed content.
-- Run AFTER schema.sql. Idempotent (safe to re-run).

-- ─── Roles ───────────────────────────────────────────────────────────────
do $$ begin
  if not exists (select 1 from pg_type where typname = 'user_role') then
    create type public.user_role as enum ('user', 'content_editor', 'admin', 'super_admin');
  end if;
end $$;

alter table public.user_profiles
  add column if not exists role public.user_role not null default 'user';

create index if not exists user_profiles_role_idx on public.user_profiles (role)
  where role <> 'user';

-- Bootstrap: pin sandro.a.pelaez@gmail.com as super_admin on every migration run.
-- Add additional bootstrap admins by appending to this list.
update public.user_profiles
set role = 'super_admin'
where user_id in (
  select id from auth.users
  where lower(email) in (lower('sandro.a.pelaez@gmail.com'))
);

-- Helper: is the current JWT a privileged user?
create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select coalesce(
    (select role in ('admin', 'super_admin', 'content_editor')
     from public.user_profiles where user_id = auth.uid()),
    false
  );
$$;

create or replace function public.is_super_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select coalesce(
    (select role = 'super_admin' from public.user_profiles where user_id = auth.uid()),
    false
  );
$$;

-- ─── Content tables (multi-language ready) ──────────────────────────────
create table if not exists public.languages (
  code         text primary key,                  -- 'kk', 'es', 'tr'
  name_en      text not null,                     -- 'Kazakh', 'Spanish'
  name_native  text not null,                     -- 'Қазақша', 'Español'
  flag_emoji   text not null default '🌐',
  status       text not null default 'active' check (status in ('draft','active','archived')),
  sort_order   integer not null default 100,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create table if not exists public.units (
  id              text primary key,
  language_code   text not null references public.languages(code) on delete cascade,
  "order"         integer not null,
  title_native    text not null,
  title_en        text not null,
  cefr_level      text not null default 'A1' check (cefr_level in ('A1','A2','B1','B2','C1','C2')),
  emoji           text not null default '📘',
  description     text,
  cultural_note   text,
  status          text not null default 'active' check (status in ('draft','active','archived')),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  unique (language_code, "order")
);
create index if not exists units_lang_idx on public.units (language_code, "order");

create table if not exists public.lessons (
  id           text primary key,
  unit_id      text not null references public.units(id) on delete cascade,
  "order"      integer not null,
  title_native text not null,
  title_en     text not null,
  status       text not null default 'active' check (status in ('draft','active','archived')),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  unique (unit_id, "order")
);
create index if not exists lessons_unit_idx on public.lessons (unit_id, "order");

create table if not exists public.vocab (
  id           text primary key,
  unit_id      text not null references public.units(id) on delete cascade,
  native       text not null,
  english      text not null,
  audio_url    text,
  morphemes    jsonb,
  example_native text,
  example_en   text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
create index if not exists vocab_unit_idx on public.vocab (unit_id);

create table if not exists public.exercises (
  id           text primary key,
  lesson_id    text not null references public.lessons(id) on delete cascade,
  "order"      integer not null,
  type         text not null check (type in (
    'MULTIPLE_CHOICE','TRANSLATE_EN_KK','TRANSLATE_KK_EN',
    'LISTENING','SPEAKING','MATCH_PAIRS','FILL_BLANK'
  )),
  prompt       jsonb not null,                    -- shape varies by type, mirrors src/core/types.ts
  audio_url    text,
  hints        text,
  status       text not null default 'active' check (status in ('draft','active','archived')),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  unique (lesson_id, "order")
);
create index if not exists exercises_lesson_idx on public.exercises (lesson_id, "order");

-- updated_at triggers for content tables
do $$
declare t text;
begin
  for t in select unnest(array['languages','units','lessons','vocab','exercises']) loop
    execute format('drop trigger if exists set_updated_at on public.%I', t);
    execute format('create trigger set_updated_at before update on public.%I
      for each row execute function public.set_updated_at()', t);
  end loop;
end $$;

-- ─── Lesson revisions (content versioning) ───────────────────────────────
create table if not exists public.lesson_revisions (
  id              bigserial primary key,
  lesson_id       text not null,                   -- not FK: keep history if lesson deleted
  snapshot        jsonb not null,                  -- {lesson, exercises[], vocab[]} at moment of edit
  edited_by       uuid references auth.users(id) on delete set null,
  edit_summary    text,
  created_at      timestamptz not null default now()
);
create index if not exists lesson_revisions_lesson_idx on public.lesson_revisions (lesson_id, created_at desc);

-- ─── Audit log (admin actions) ───────────────────────────────────────────
create table if not exists public.admin_audit_log (
  id           bigserial primary key,
  actor_id     uuid references auth.users(id) on delete set null,
  actor_email  text,                                -- denormalised for log readability
  action       text not null,                       -- 'grant_admin', 'edit_lesson', 'delete_user', ...
  target_type  text,                                -- 'user', 'lesson', 'unit', 'admin', ...
  target_id    text,                                -- whatever id makes sense for the action
  before_state jsonb,
  after_state  jsonb,
  metadata     jsonb,
  created_at   timestamptz not null default now()
);
create index if not exists admin_audit_log_created_idx on public.admin_audit_log (created_at desc);
create index if not exists admin_audit_log_actor_idx on public.admin_audit_log (actor_id, created_at desc);

-- ─── RLS policies ────────────────────────────────────────────────────────

-- Content tables: anyone authenticated reads ACTIVE rows; admins read all and write.
alter table public.languages enable row level security;
alter table public.units enable row level security;
alter table public.lessons enable row level security;
alter table public.vocab enable row level security;
alter table public.exercises enable row level security;

-- Languages
drop policy if exists "languages read active" on public.languages;
create policy "languages read active" on public.languages for select
  using (status = 'active' or public.is_admin());
drop policy if exists "languages admin write" on public.languages;
create policy "languages admin write" on public.languages for all
  using (public.is_admin()) with check (public.is_admin());

-- Units
drop policy if exists "units read active" on public.units;
create policy "units read active" on public.units for select
  using (status = 'active' or public.is_admin());
drop policy if exists "units admin write" on public.units;
create policy "units admin write" on public.units for all
  using (public.is_admin()) with check (public.is_admin());

-- Lessons
drop policy if exists "lessons read active" on public.lessons;
create policy "lessons read active" on public.lessons for select
  using (status = 'active' or public.is_admin());
drop policy if exists "lessons admin write" on public.lessons;
create policy "lessons admin write" on public.lessons for all
  using (public.is_admin()) with check (public.is_admin());

-- Vocab
drop policy if exists "vocab read auth" on public.vocab;
create policy "vocab read auth" on public.vocab for select
  using (auth.uid() is not null);
drop policy if exists "vocab admin write" on public.vocab;
create policy "vocab admin write" on public.vocab for all
  using (public.is_admin()) with check (public.is_admin());

-- Exercises
drop policy if exists "exercises read active" on public.exercises;
create policy "exercises read active" on public.exercises for select
  using (status = 'active' or public.is_admin());
drop policy if exists "exercises admin write" on public.exercises;
create policy "exercises admin write" on public.exercises for all
  using (public.is_admin()) with check (public.is_admin());

-- Revisions: admins read, no client writes (server-only).
alter table public.lesson_revisions enable row level security;
drop policy if exists "revisions admin read" on public.lesson_revisions;
create policy "revisions admin read" on public.lesson_revisions for select
  using (public.is_admin());

-- Audit log: admins read, no client writes.
alter table public.admin_audit_log enable row level security;
drop policy if exists "audit admin read" on public.admin_audit_log;
create policy "audit admin read" on public.admin_audit_log for select
  using (public.is_admin());

-- ─── Admin-visible view on user_profiles ─────────────────────────────────
-- Lets admins SELECT richer fields than the public profile policy permits.
drop policy if exists "profiles admin read" on public.user_profiles;
create policy "profiles admin read" on public.user_profiles for select
  using (public.is_admin() or auth.uid() = user_id);

drop policy if exists "profiles admin update" on public.user_profiles;
create policy "profiles admin update" on public.user_profiles for update
  using (public.is_admin() or auth.uid() = user_id)
  with check (public.is_admin() or auth.uid() = user_id);
