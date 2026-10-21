-- Check migrations/016_lock_profile_role.sql from the Supabase SQL editor.
-- Paste and run after 016. It changes nothing: each case runs in a
-- sub-transaction that is rolled back, and only the report table (a temp
-- table, gone when the session ends) keeps the results.
-- It picks the oldest ordinary user and the oldest super_admin itself.
-- Every row should say PASS.

create temp table if not exists _check_016 (n int, case_name text, expected text, got text, verdict text);
truncate _check_016;

do $$
declare
  usr uuid := (select user_id from public.user_profiles where role = 'user' order by created_at limit 1);
  sup uuid := (select user_id from public.user_profiles where role = 'super_admin' order by created_at limit 1);
  c record;
  rows bigint;
  got text;
begin
  if usr is null or sup is null then
    raise exception 'need at least one ordinary user and one super_admin to run the checks';
  end if;

  for c in select * from (values
    (1, 'user promotes self to super_admin', null, 'authenticated', usr,
        format('update public.user_profiles set role = %L where user_id = %L', 'super_admin', usr),
        'ERROR: only a super_admin can change user_profiles.role'),
    (2, 'user upserts own row with role=admin', null, 'authenticated', usr,
        format('insert into public.user_profiles (user_id, display_name, role) values (%L, %L, %L)
                on conflict (user_id) do update set role = excluded.role', usr, 'pwned', 'admin'),
        'ERROR: only a super_admin can change user_profiles.role'),
    (3, 'content_editor promotes self to super_admin',
        format('update public.user_profiles set role = %L where user_id = %L', 'content_editor', usr),
        'authenticated', usr,
        format('update public.user_profiles set role = %L where user_id = %L', 'super_admin', usr),
        'ERROR: only a super_admin can change user_profiles.role'),
    (4, 'user edits own non-role fields', null, 'authenticated', usr,
        format('update public.user_profiles set display_name = %L, role = role where user_id = %L', 'Renamed', usr),
        'UPDATE 1'),
    (5, 'service_role changes a role (api/admin.ts)', null, 'service_role', null,
        format('update public.user_profiles set role = %L where user_id = %L', 'admin', usr),
        'UPDATE 1'),
    (6, 'super_admin edits another user via PostgREST', null, 'authenticated', sup,
        format('update public.user_profiles set display_name = %L where user_id = %L', 'Edited', usr),
        'UPDATE 0'),
    (7, 'SQL editor (postgres) changes a role', null, 'postgres', null,
        format('update public.user_profiles set role = %L where user_id = %L', 'admin', usr),
        'UPDATE 1'),
    (8, 'content_editor edits another user via PostgREST',
        format('update public.user_profiles set role = %L where user_id = %L', 'content_editor', usr),
        'authenticated', usr,
        format('update public.user_profiles set display_name = %L where user_id = %L', 'Edited', sup),
        'UPDATE 0')
  ) as v(n, case_name, prep, as_role, sub, stmt, expected) loop
    begin
      if c.prep is not null then execute c.prep; end if;
      perform set_config('request.jwt.claims',
        json_build_object('sub', c.sub, 'role', c.as_role)::text, true);
      perform set_config('role', c.as_role, true);
      execute c.stmt;
      get diagnostics rows = row_count;
      got := 'UPDATE ' || rows;
      raise exception '__rollback__';
    exception when others then
      if sqlerrm <> '__rollback__' then got := 'ERROR: ' || sqlerrm; end if;
    end;
    insert into _check_016 values (c.n, c.case_name, c.expected, got,
      case when got = c.expected then 'PASS' else 'FAIL' end);
  end loop;

  insert into _check_016
  select 9, 'guard_profile_role trigger installed', 'present',
         coalesce(max(tgname), 'missing'), case when count(*) = 1 then 'PASS' else 'FAIL' end
  from pg_trigger where tgrelid = 'public.user_profiles'::regclass and tgname = 'guard_profile_role';

  insert into _check_016
  select 10, 'UPDATE policies on user_profiles', 'profiles update self',
         coalesce(string_agg(polname, ', ' order by polname), 'none'),
         case when coalesce(string_agg(polname, ', '), '') = 'profiles update self' then 'PASS' else 'FAIL' end
  from pg_policy where polrelid = 'public.user_profiles'::regclass and polcmd = 'w';
end $$;

select n, case_name, expected, got, verdict from _check_016 order by n;
