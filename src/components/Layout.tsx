import { Outlet, NavLink, useLocation } from "react-router-dom";
import { useStore } from "@/store/useStore";
import { isAdminRole, useAuth } from "@/core/useAuth";
import { Icon, Logo, NavItem, StatChip, type IconName } from "@/components/ui";

const TABS: TabProps[] = [
  { to: "/", label: "Learn", icon: "home" },
  { to: "/practice", label: "Practice", icon: "review" },
  { to: "/profile", label: "Profile", icon: "user" },
];

export default function Layout() {
  const { pathname } = useLocation();
  const hideChrome =
    pathname.startsWith("/lesson/") ||
    pathname.startsWith("/auth/") ||
    pathname === "/welcome";

  const streak = useStore((s) => s.streakCount);
  const { role } = useAuth();
  const showAdmin = isAdminRole(role);

  return (
    <div className="min-h-screen flex flex-col">
      {!hideChrome && (
        <header className="sticky top-0 z-30 bg-berkut-bg/90 backdrop-blur pt-[env(safe-area-inset-top)]">
          <div className="mx-auto max-w-content sm:max-w-none sm:pl-56 sm:pr-6 px-4 h-14 flex items-center gap-2">
            <NavLink to="/" className="flex items-center gap-2 sm:hidden" aria-label="Berkut home">
              <Logo size={28} wordmark />
            </NavLink>
            <div className="ml-auto flex items-center gap-1.5">
              <StatChip value={streak} />
            </div>
          </div>
        </header>
      )}

      <main className={hideChrome ? "flex-1" : "flex-1 pb-[calc(88px+env(safe-area-inset-bottom))] sm:pb-10 sm:pl-52"}>
        <Outlet />
      </main>

      {!hideChrome && (
        <nav
          aria-label="Main"
          className="fixed bottom-0 inset-x-0 z-20 bg-berkut-surface-raised shadow-sheet pb-[env(safe-area-inset-bottom)] sm:hidden"
        >
          <div className="mx-auto max-w-content grid grid-cols-3">
            {TABS.map((t) => (
              <Tab key={t.to} {...t} />
            ))}
          </div>
        </nav>
      )}

      {!hideChrome && (
        <nav aria-label="Main" className="hidden sm:flex fixed inset-y-0 left-0 z-40 w-52 flex-col gap-1 bg-berkut-surface-raised px-3 py-5 shadow-card">
          <NavLink to="/" className="mb-5 flex items-center px-3" aria-label="Berkut home">
            <Logo size={30} wordmark />
          </NavLink>
          {TABS.map((t) => (
            <SideTab key={t.to} {...t} />
          ))}
          <SideTab to="/settings" label="Settings" icon="settings" />
          {showAdmin && <SideTab to="/admin" label="Admin" icon="shield" />}
        </nav>
      )}
    </div>
  );
}

type TabProps = { to: string; label: string; icon: IconName };

function Tab({ to, label, icon }: TabProps) {
  return (
    <NavLink
      to={to}
      end={to === "/"}
      className={({ isActive }) =>
        `relative flex h-16 flex-col items-center justify-center gap-0.5 text-xs font-semibold transition ${
          isActive
            ? "text-berkut-turquoise-ink before:absolute before:top-0 before:inset-x-[30%] before:h-[3px] before:rounded-b before:bg-berkut-turquoise"
            : "text-berkut-ink-muted"
        }`
      }
    >
      <Icon name={icon} />
      <span>{label}</span>
    </NavLink>
  );
}

function SideTab({ to, label, icon }: TabProps) {
  return <NavItem to={to} end={to === "/"} label={label} icon={icon} />;
}
