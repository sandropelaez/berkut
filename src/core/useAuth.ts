import { useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { getSupabase, isSupabaseConfigured } from "./supabase";

interface AuthState {
  session: Session | null;
  user: User | null;
  loading: boolean;
}

// useAuth subscribes to Supabase auth state changes and exposes the current
// session, the user, and a loading flag while the initial getSession() resolves.
// When Supabase isn't configured (no env vars), it short-circuits to a
// non-loading, no-session state so local dev still works.
export function useAuth(): AuthState {
  const [state, setState] = useState<AuthState>({
    session: null,
    user: null,
    loading: isSupabaseConfigured(),
  });

  useEffect(() => {
    const sb = getSupabase();
    if (!sb) return;

    let mounted = true;
    sb.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setState({
        session: data.session,
        user: data.session?.user ?? null,
        loading: false,
      });
    });

    const { data: sub } = sb.auth.onAuthStateChange((_event, session) => {
      setState({
        session,
        user: session?.user ?? null,
        loading: false,
      });
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return state;
}
