-- Berkut v1.5 — A1-A2 unit-status finalisation.
-- Idempotent. Run AFTER 005 + 006-009 in any order.
--
-- Why this exists: migrations 005 and 006-009 each set unit.status as part
-- of their inserts. If 005 is applied AFTER one of the content migrations
-- (which can happen during recovery from a partial apply), 005's
-- `on conflict do update set ... status=excluded.status` resets units
-- 7-24 back to 'draft' — orphaning content that already exists.
--
-- This migration asserts the canonical end state: every A1.1, A1.2, A2.1,
-- A2.2 unit is active. Safe to re-run anytime.

update public.units
set status = 'active'
where language_code = 'kk'
  and id in (
    -- A1.1
    'u1','u2','u3','u4','u5','u6',
    -- A1.2
    'u7','u8','u9','u10','u11','u12',
    -- A2.1
    'u13','u14','u15','u16','u17','u18',
    -- A2.2
    'u19','u20','u21','u22','u23','u24'
  );
