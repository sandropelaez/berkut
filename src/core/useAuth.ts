import { useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { getSupabase, isSupabaseConfigured } from "./supabase";

export type Role = "user" | "content_editor" | "admin" | "super_admin";

interface AuthState {
  session: Session | null;
  user: User | null;
  role: Role;
  loading: boolean;
}

// useAuth subscribes to Supabase auth state and also fetches the user's role
// from public.user_profiles for client-side gating. Server endpoints re-check
// the role independently — the client value is purely for UI affordances.
export function useAuth(): AuthState {
  const [state, setState] = useState<AuthState>({
    session: null,
    user: null,
    role: "user",
    loading: isSupabaseConfigured(),
  });

  useEffect(() => {
    const sb = getSupabase();
    if (!sb) return;

    let mounted = true;

    async function refresh(session: Session | null) {
      if (!mounted) return;
      if (!session || !sb) {
        setState({ session: null, user: null, role: "user", loading: false });
        return;
      }
      const { data: profile } = await sb
        .from("user_profiles")
        .select("role")
        .eq("user_id", session.user.id)
        .maybeSingle();
      if (!mounted) return;
      setState({
        session,
        user: session.user,
        role: (profile?.role as Role) ?? "user",
        loading: false,
      });
    }

    sb.auth.getSession().then(({ data }) => refresh(data.session));
    const { data: sub } = sb.auth.onAuthStateChange((_event, session) => refresh(session));

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return state;
}

export function isAdminRole(role: Role): boolean {
  return role === "content_editor" || role === "admin" || role === "super_admin";
}
