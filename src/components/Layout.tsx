import { Outlet, NavLink, useLocation } from "react-router-dom";
import { useStore } from "@/store/useStore";
import { isAdminRole, useAuth } from "@/core/useAuth";
import {
  HomeIcon,
  RepeatIcon,
  ReviewIcon,
  SettingsIcon,
  ShieldIcon,
  StatChip,
  SunMark,
  UserIcon,
} from "@/components/ui";

const TABS = [
  { to: "/", label: "Learn", Icon: HomeIcon },
  { to: "/practice", label: "Practice", Icon: ReviewIcon },
  { to: "/repeat", label: "Repeat", Icon: RepeatIcon },
  { to: "/profile", label: "Profile", Icon: UserIcon },
];

export default function Layout() {
  const { pathname } = useLocation();
  const hideChrome =
    pathname.startsWith("/lesson/") ||
    pathname.startsWith("/repeat/") ||
    pathname.startsWith("/auth/") ||
    pathname === "/welcome";

  const streak = useStore((s) => s.streakCount);
  const { role } = useAuth();
  const showAdmin = isAdminRole(role);

  return (
    <div className="min-h-screen flex flex-col">
      {!hideChrome && (
        <header className="sticky top-0 z-30 bg-berkut-surface/90 backdrop-blur pt-[env(safe-area-inset-top)]">
          <div className="mx-auto max-w-content sm:max-w-none sm:pl-56 sm:pr-6 px-4 h-14 flex items-center gap-2">
            <NavLink to="/" className="flex items-center gap-2 sm:hidden" aria-label="Berkut home">
              <SunMark size={30} />
              <span className="font-display font-semibold text-[17px] tracking-tight">Berkut</span>
            </NavLink>
            <div className="ml-auto flex items-center gap-1.5">
              <StatChip kind="streak" value={streak} />
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
          className="fixed bottom-0 inset-x-0 z-20 bg-berkut-raised shadow-sheet pb-[env(safe-area-inset-bottom)] sm:hidden"
        >
          <div className="mx-auto max-w-content grid grid-cols-4">
            {TABS.map((t) => (
              <Tab key={t.to} {...t} />
            ))}
          </div>
        </nav>
      )}

      {!hideChrome && (
        <nav aria-label="Main" className="hidden sm:flex fixed inset-y-0 left-0 z-40 w-52 flex-col gap-1 bg-berkut-raised px-3 py-5 shadow-card">
          <NavLink to="/" className="mb-5 flex items-center gap-2.5 px-3">
            <SunMark size={34} />
            <span className="font-display font-semibold text-lg tracking-tight">Berkut</span>
          </NavLink>
          {TABS.map((t) => (
            <SideTab key={t.to} {...t} />
          ))}
          <SideTab to="/settings" label="Settings" Icon={SettingsIcon} />
          {showAdmin && <SideTab to="/admin" label="Admin" Icon={ShieldIcon} />}
        </nav>
      )}
    </div>
  );
}

type TabProps = { to: string; label: string; Icon: (p: { className?: string }) => JSX.Element };

function Tab({ to, label, Icon }: TabProps) {
  return (
    <NavLink
      to={to}
      end={to === "/"}
      className={({ isActive }) =>
        `relative flex h-16 flex-col items-center justify-center gap-0.5 text-[11px] font-semibold tracking-[0.02em] transition ${
          isActive
            ? "text-berkut-sky-ink before:absolute before:top-0 before:inset-x-[30%] before:h-[3px] before:rounded-b before:bg-berkut-sky"
            : "text-berkut-muted"
        }`
      }
    >
      <Icon className="h-6 w-6" />
      <span>{label}</span>
    </NavLink>
  );
}

function SideTab({ to, label, Icon }: TabProps) {
  return (
    <NavLink
      to={to}
      end={to === "/"}
      className={({ isActive }) =>
        `flex h-12 items-center gap-3 rounded-tile px-3 text-[15px] font-semibold transition ${
          isActive
            ? "bg-berkut-sky-soft text-berkut-sky-ink"
            : "text-berkut-muted hover:bg-berkut-sunk hover:text-berkut-ink"
        }`
      }
    >
      <Icon className="h-6 w-6" />
      <span>{label}</span>
    </NavLink>
  );
}
