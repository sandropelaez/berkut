import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/core/useAuth";
import { isSupabaseConfigured } from "@/core/supabase";
import { SunLoader } from "@/components/ui";

// RequireAuth gates a route on a valid Supabase session.
//
// - If Supabase isn't configured (env vars missing), we let the user through —
//   this preserves localStorage-only mode for local dev or offline forks.
// - While the session is loading, we render a minimal splash to avoid flashing
//   the protected UI for a frame before the redirect lands.
// - If there's no session, we redirect to /auth/login and remember where the
//   user was trying to go in location.state.from, so the login page can bounce
//   them back after sign-in.
export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const { session, loading } = useAuth();
  const location = useLocation();

  if (!isSupabaseConfigured()) return <>{children}</>;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <SunLoader />
      </div>
    );
  }

  if (!session) {
    return (
      <Navigate
        to="/auth/login"
        replace
        state={{ from: location.pathname + location.search }}
      />
    );
  }

  return <>{children}</>;
}
