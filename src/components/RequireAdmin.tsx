import { Navigate, useLocation } from "react-router-dom";
import { isAdminRole, useAuth } from "@/core/useAuth";

// RequireAdmin is the second gate (after RequireAuth). Client-side check is
// for UI only; every /api/admin/* endpoint re-validates server-side.
export default function RequireAdmin({ children }: { children: React.ReactNode }) {
  const { session, role, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-3xl animate-pulse">🦅</div>
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

  if (!isAdminRole(role)) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="max-w-md text-center">
          <div className="text-6xl">🔒</div>
          <h1 className="text-2xl font-extrabold mt-3">Admins only</h1>
          <p className="text-berkut-muted dark:text-berkut-muted-dark mt-2">
            You don't have permission to view this page.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
