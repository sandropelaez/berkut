-- 016 — Repeat: exercises the learner got wrong.
--
-- /api/progress stores each learner's mistake list (exercise id → streak of
-- correct answers, miss count, timestamps) alongside lessons and SRS. Cleared
-- exercises stay in the map with clearedAt set so cross-device merges don't
-- bring them back. See docs/repetition.md.
--
-- Additive and idempotent. Run it before deploying the code that reads it.

alter table public.user_progress
  add column if not exists mistakes jsonb not null default '{}'::jsonb;
