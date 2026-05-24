import { Navigate } from "react-router-dom";
import { useAuth } from "@/core/useAuth";
import { isSupabaseConfigured } from "@/core/supabase";

// Wrap auth pages (login, register, forgot) so signed-in users aren't shown
// the sign-in form. They get bounced to the skill tree instead.
//
// /auth/callback, /auth/reset, /auth/verify-email are NOT wrapped — those
// are mid-flow pages that need to run even when a (partial) session exists.
export default function RedirectIfAuthed({ children }: { children: React.ReactNode }) {
  const { session, loading } = useAuth();

  if (!isSupabaseConfigured()) return <>{children}</>;
  if (loading) return null;
  if (session) return <Navigate to="/" replace />;
  return <>{children}</>;
}
