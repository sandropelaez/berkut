-- Berkut v1.4 — Exercise reports + confidence flags on exercises.
-- Run AFTER 002_admin_and_content.sql. Idempotent.

-- ─── exercises: confidence + needs_review ────────────────────────────────
-- Used when content is generated (e.g. A1→B2 batch) so admins can triage
-- the AI-uncertain ones first instead of reviewing all 5000 by hand.
alter table public.exercises
  add column if not exists confidence text not null default 'high'
    check (confidence in ('high', 'medium', 'low')),
  add column if not exists needs_review boolean not null default false,
  add column if not exists report_count integer not null default 0;

create index if not exists exercises_needs_review_idx on public.exercises (needs_review)
  where needs_review = true;

-- ─── exercise_reports ────────────────────────────────────────────────────
create table if not exists public.exercise_reports (
  id           bigserial primary key,
  exercise_id  text not null references public.exercises(id) on delete cascade,
  lesson_id    text,                                  -- denormalised, for fast triage
  reporter_id  uuid references auth.users(id) on delete set null,
  reporter_email text,                                -- denormalised; reporter row may be deleted
  reason       text not null check (reason in (
    'wrong_translation','grammar_error','typo','bad_audio',
    'too_hard','too_easy','offensive','other'
  )),
  comment      text,
  status       text not null default 'open'
    check (status in ('open', 'resolved', 'dismissed')),
  admin_notes  text,
  resolved_by  uuid references auth.users(id) on delete set null,
  resolved_at  timestamptz,
  created_at   timestamptz not null default now()
);
create index if not exists exercise_reports_status_idx
  on public.exercise_reports (status, created_at desc);
create index if not exists exercise_reports_exercise_idx
  on public.exercise_reports (exercise_id);
create index if not exists exercise_reports_reporter_idx
  on public.exercise_reports (reporter_id);

-- Maintain report_count on exercises via trigger so admin lists can sort
-- by "most-reported" cheaply without a join.
create or replace function public.bump_exercise_report_count() returns trigger
language plpgsql security definer as $$
begin
  if (tg_op = 'INSERT') then
    update public.exercises
      set report_count = report_count + 1,
          needs_review = true
      where id = new.exercise_id;
  elsif (tg_op = 'DELETE') then
    update public.exercises
      set report_count = greatest(report_count - 1, 0)
      where id = old.exercise_id;
  end if;
  return null;
end; $$;

drop trigger if exists on_exercise_report_change on public.exercise_reports;
create trigger on_exercise_report_change
  after insert or delete on public.exercise_reports
  for each row execute function public.bump_exercise_report_count();

-- ─── RLS ─────────────────────────────────────────────────────────────────
alter table public.exercise_reports enable row level security;

drop policy if exists "reports insert auth" on public.exercise_reports;
create policy "reports insert auth" on public.exercise_reports for insert
  with check (auth.uid() is not null and auth.uid() = reporter_id);

drop policy if exists "reports read own or admin" on public.exercise_reports;
create policy "reports read own or admin" on public.exercise_reports for select
  using (auth.uid() = reporter_id or public.is_admin());

drop policy if exists "reports admin update" on public.exercise_reports;
create policy "reports admin update" on public.exercise_reports for update
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "reports admin delete" on public.exercise_reports;
create policy "reports admin delete" on public.exercise_reports for delete
  using (public.is_admin());
