import { Link, Outlet } from "react-router-dom";
import { useAuth } from "@/core/useAuth";
import { Logo, NavItem, type IconName } from "@/components/ui";
import RoleBadge from "@/admin/RoleBadge";

const links: Array<{ to: string; end?: boolean; label: string; icon: IconName }> = [
  { to: "/admin", end: true, label: "Overview", icon: "chart" },
  { to: "/admin/users", label: "Users", icon: "users" },
  { to: "/admin/admins", label: "Admins", icon: "key" },
  { to: "/admin/content", label: "Content", icon: "book" },
  { to: "/admin/reports", label: "Reports", icon: "flag" },
  { to: "/admin/audit", label: "Audit log", icon: "list" },
  { to: "/admin/analytics", label: "Analytics", icon: "trend" },
];

export default function AdminLayout() {
  const { user, role } = useAuth();
  return (
    <div className="min-h-screen flex flex-col sm:flex-row bg-berkut-bg">
      <aside className="flex-none bg-berkut-surface-raised shadow-card sm:sticky sm:top-0 sm:h-screen sm:w-60 sm:overflow-y-auto">
        <div className="flex flex-col gap-4 px-4 py-4 sm:gap-6 sm:py-6">
          <Link to="/" className="flex items-center gap-3 px-2" aria-label="Back to Berkut">
            <Logo size={28} wordmark />
            <span className="text-small text-berkut-ink-muted">Admin</span>
          </Link>
          <nav aria-label="Admin" className="-mx-4 flex gap-1 overflow-x-auto px-4 sm:mx-0 sm:flex-col sm:px-0">
            {links.map((l) => (
              <div key={l.to} className="flex-none sm:flex-auto">
                <NavItem to={l.to} end={l.end} label={l.label} icon={l.icon} />
              </div>
            ))}
          </nav>
          <div className="hidden flex-col gap-2 border-t border-berkut-line px-2 pt-5 sm:flex">
            <span className="text-caption text-berkut-ink-muted">Signed in as</span>
            <span className="truncate text-small font-semibold text-berkut-ink">{user?.email}</span>
            <div>
              <RoleBadge role={role} />
            </div>
            <Link to="/" className="mt-2 text-small font-semibold text-berkut-turquoise-ink hover:underline">
              Back to the app
            </Link>
          </div>
        </div>
      </aside>
      <main className="flex-1 min-w-0 px-6 py-6 sm:px-8 sm:py-8">
        <div className="mx-auto max-w-[1120px]">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
