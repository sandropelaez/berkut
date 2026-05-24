import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "@/core/useAuth";

const links = [
  { to: "/admin", end: true, label: "Overview", icon: "📊" },
  { to: "/admin/users", label: "Users", icon: "👥" },
  { to: "/admin/admins", label: "Admins", icon: "🔑" },
  { to: "/admin/content", label: "Content", icon: "📚" },
  { to: "/admin/audit", label: "Audit log", icon: "🗒" },
  { to: "/admin/analytics", label: "Analytics", icon: "📈" },
];

export default function AdminLayout() {
  const { user, role } = useAuth();
  return (
    <div className="min-h-screen flex flex-col sm:flex-row">
      <aside className="sm:w-64 sm:min-h-screen border-r border-berkut-border dark:border-berkut-border-dark bg-white dark:bg-berkut-card-dark p-4">
        <NavLink to="/" className="flex items-center gap-2 font-extrabold text-xl mb-6">
          <span className="text-2xl">🦅</span> Berkut <span className="text-xs text-berkut-muted dark:text-berkut-muted-dark uppercase tracking-wider">admin</span>
        </NavLink>
        <nav className="flex flex-row sm:flex-col gap-1 overflow-x-auto">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition ${
                  isActive
                    ? "bg-berkut-primary/10 text-berkut-primary"
                    : "text-berkut-muted dark:text-berkut-muted-dark hover:bg-black/5 dark:hover:bg-white/5"
                }`
              }
            >
              <span>{l.icon}</span>
              <span>{l.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="mt-8 pt-4 border-t border-berkut-border dark:border-berkut-border-dark hidden sm:block">
          <div className="text-xs text-berkut-muted dark:text-berkut-muted-dark">Signed in</div>
          <div className="font-bold text-sm truncate">{user?.email}</div>
          <div className="text-xs text-berkut-primary mt-1 font-semibold uppercase tracking-wide">
            {role.replace("_", " ")}
          </div>
          <NavLink to="/" className="block mt-3 text-xs text-berkut-muted dark:text-berkut-muted-dark hover:underline">
            ← Back to app
          </NavLink>
        </div>
      </aside>
      <main className="flex-1 px-4 sm:px-8 py-6 max-w-6xl">
        <Outlet />
      </main>
    </div>
  );
}
