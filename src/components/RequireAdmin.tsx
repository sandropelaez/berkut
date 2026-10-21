import { Navigate, useLocation } from "react-router-dom";
import { isAdminRole, useAuth } from "@/core/useAuth";
import { Icon, Loader } from "@/components/ui";

// RequireAdmin is the second gate (after RequireAuth). Client-side check is
// for UI only; every /api/admin/* endpoint re-validates server-side.
export default function RequireAdmin({ children }: { children: React.ReactNode }) {
  const { session, role, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
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
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-berkut-surface text-berkut-ink-muted">
            <Icon name="lock" size={32} />
          </span>
          <h1 className="text-title-lg mt-4">Admins only</h1>
          <p className="text-berkut-ink-muted mt-2">
            You don't have permission to view this page.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
