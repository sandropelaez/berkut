-- 014 — Cross-device progress sync.
--
-- /api/progress now merges each device's snapshot into user_progress +
-- user_profiles. Streak merging needs the user's local calendar day of their
-- last activity; user_profiles.last_active_at stays a real timestamp (it feeds
-- the admin DAU/WAU/MAU counts), so the day key gets its own column.
--
-- Additive and nullable. Run it before deploying the code that reads it.

alter table public.user_progress
  add column if not exists last_active_date date;
