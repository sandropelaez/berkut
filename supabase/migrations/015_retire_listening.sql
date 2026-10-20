-- Berkut v1.7 — Retire Listening exercises.
-- Idempotent. Safe to re-run anytime (and after re-applying older migrations,
-- which upsert these rows back to 'active').
--
-- Listening exercises play Kazakh through the browser's speech synthesis,
-- which reads it poorly (most devices have no kk-KZ voice and fall back to
-- Russian). Archived rather than deleted so exercise reports and the content
-- stay intact for when recorded audio replaces TTS. /api/content also skips
-- this type, so learners never see them either way.

update public.exercises
  set status = 'archived'
  where type = 'LISTENING'
    and status <> 'archived';
