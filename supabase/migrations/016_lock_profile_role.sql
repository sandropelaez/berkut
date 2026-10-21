-- Berkut — stop signed-in users from changing user_profiles.role.
-- Idempotent (safe to re-run). No app deploy needed.
--
-- The "profiles update self" / "profiles admin update" policies only check
-- auth.uid() = user_id (or is_admin()), and `authenticated` can UPDATE every
-- column. So any user could PATCH user_profiles?user_id=eq.<self> with
-- {"role":"super_admin"} using the anon key and their own JWT, and
-- api/_lib/admin.ts would then treat them as a super_admin.
--
-- This migration also drops "profiles admin update" (see the end of the file).
--
-- The trigger rejects a role change (or an INSERT with a role other than
-- 'user') made as the PostgREST client roles `anon` / `authenticated`, unless
-- the caller is already a super_admin. service_role (api/admin.ts grants and
-- revokes through it), postgres (SQL editor, the 002 bootstrap) and
-- security-definer functions are unaffected.
--
-- The same function is in schema.sql, which runs before 002 adds the role
-- column; to_jsonb() keeps it valid there.

create or replace function public.guard_profile_role() returns trigger
language plpgsql set search_path = public as $$
begin
  -- Not security definer: current_user must be the caller's role.
  if current_user not in ('anon', 'authenticated') then
    return new;
  end if;

  if (tg_op = 'INSERT' and coalesce(to_jsonb(new)->>'role', 'user') <> 'user')
     or (tg_op = 'UPDATE' and to_jsonb(new)->'role' is distinct from to_jsonb(old)->'role') then
    if not public.is_super_admin() then
      raise exception 'only a super_admin can change user_profiles.role'
        using errcode = '42501';  -- insufficient_privilege → HTTP 403 from PostgREST
    end if;
  end if;

  return new;
end; $$;

drop trigger if exists guard_profile_role on public.user_profiles;
create trigger guard_profile_role before insert or update on public.user_profiles
  for each row execute function public.guard_profile_role();

-- "profiles admin update" (002) let any is_admin() caller, content_editor
-- included, edit every user's row straight through PostgREST. Nothing in the
-- app uses it: admin edits go through api/admin.ts with the service role.
-- Users editing their own row is "profiles update self", re-asserted here so
-- dropping the admin policy can't take self-updates (api/progress.ts) with it.
drop policy if exists "profiles admin update" on public.user_profiles;

drop policy if exists "profiles update self" on public.user_profiles;
create policy "profiles update self"
  on public.user_profiles for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Check: any non-'user' role that a non-bootstrap account may have granted
-- itself before this fix. Review the rows by hand; not changed here.
--   select p.user_id, u.email, p.role, p.updated_at
--   from public.user_profiles p join auth.users u on u.id = p.user_id
--   where p.role <> 'user'
--   order by p.updated_at desc;
