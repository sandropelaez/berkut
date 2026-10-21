-- Verification for migrations/016_lock_profile_role.sql.
-- Each case runs in a transaction that is rolled back, so this is safe to run
-- on any database that has 016 applied (including prod, from the SQL editor).
-- Replace the uuids with real ones: :attacker = any ordinary user,
-- :super = a super_admin. In psql:
--   psql ... -v attacker="'<uuid>'" -v super="'<uuid>'" -f 016_lock_profile_role.sql
-- Expected: cases 1-3 fail with "only a super_admin can change user_profiles.role",
-- cases 4, 5 and 7 succeed (UPDATE 1), and cases 6 and 8 match no rows (UPDATE 0)
-- because no admin can edit another user's row through PostgREST any more.

\set ON_ERROR_STOP 0

\echo '1. user promotes self to super_admin (the attack) -> must FAIL'
begin;
set local role authenticated;
select set_config('request.jwt.claims', json_build_object('sub', :attacker, 'role', 'authenticated')::text, true);
update public.user_profiles set role = 'super_admin' where user_id = :attacker;
rollback;

\echo '2. user upserts own row with role=admin (insert ... on conflict) -> must FAIL'
begin;
set local role authenticated;
select set_config('request.jwt.claims', json_build_object('sub', :attacker, 'role', 'authenticated')::text, true);
insert into public.user_profiles (user_id, display_name, role) values (:attacker, 'pwned', 'admin')
  on conflict (user_id) do update set role = excluded.role;
rollback;

\echo '3. same attack while the user is already content_editor -> must FAIL'
begin;
update public.user_profiles set role = 'content_editor' where user_id = :attacker;  -- as postgres
set local role authenticated;
select set_config('request.jwt.claims', json_build_object('sub', :attacker, 'role', 'authenticated')::text, true);
update public.user_profiles set role = 'super_admin' where user_id = :attacker;
rollback;

\echo '4. user edits own non-role fields (incl. PATCH echoing the same role) -> must SUCCEED (UPDATE 1)'
begin;
set local role authenticated;
select set_config('request.jwt.claims', json_build_object('sub', :attacker, 'role', 'authenticated')::text, true);
update public.user_profiles set display_name = 'Renamed', script_pref = 'LATIN', role = role where user_id = :attacker;
rollback;

\echo '5. service_role (api/admin.ts grant/revoke) changes a role -> must SUCCEED (UPDATE 1)'
begin;
set local role service_role;
select set_config('request.jwt.claims', json_build_object('role', 'service_role')::text, true);
update public.user_profiles set role = 'admin' where user_id = :attacker;
update public.user_profiles set role = 'user' where user_id = :attacker;
rollback;

\echo '6. super_admin edits another user''s row via PostgREST -> must match nothing (UPDATE 0)'
begin;
set local role authenticated;
select set_config('request.jwt.claims', json_build_object('sub', :super, 'role', 'authenticated')::text, true);
update public.user_profiles set role = 'content_editor', display_name = 'Edited' where user_id = :attacker;
rollback;

\echo '7. postgres / SQL editor (002 bootstrap) changes a role -> must SUCCEED (UPDATE 1)'
begin;
update public.user_profiles set role = 'admin' where user_id = :attacker;
rollback;

\echo '8. content_editor edits another user''s row via PostgREST -> must match nothing (UPDATE 0)'
begin;
update public.user_profiles set role = 'content_editor' where user_id = :attacker;  -- as postgres
set local role authenticated;
select set_config('request.jwt.claims', json_build_object('sub', :attacker, 'role', 'authenticated')::text, true);
update public.user_profiles set display_name = 'Edited', streak_count = 999 where user_id = :super;
rollback;

\echo 'final state (should be unchanged):'
select user_id, display_name, role from public.user_profiles where user_id in (:attacker, :super);
