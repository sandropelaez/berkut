import { Navigate, useLocation } from "react-router-dom";
import { isAdminRole, useAuth } from "@/core/useAuth";
import { LockIcon, SunLoader } from "@/components/ui";

// RequireAdmin is the second gate (after RequireAuth). Client-side check is
// for UI only; every /api/admin/* endpoint re-validates server-side.
export default function RequireAdmin({ children }: { children: React.ReactNode }) {
  const { session, role, loading } = useAuth();
  const location = useLocation();

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

  if (!isAdminRole(role)) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="max-w-md text-center">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-berkut-sunk text-berkut-muted">
            <LockIcon className="h-8 w-8" />
          </span>
          <h1 className="text-2xl mt-4">Admins only</h1>
          <p className="text-berkut-muted dark:text-berkut-muted-dark mt-2">
            You don't have permission to view this page.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
