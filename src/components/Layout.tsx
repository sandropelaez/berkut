import { Outlet, NavLink, useLocation } from "react-router-dom";
import { useStore } from "@/store/useStore";

const TabIcon = ({ d }: { d: string }) => (
  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const HomeIcon = () => <TabIcon d="M3 12l9-9 9 9M5 10v10h14V10" />;
const RefreshIcon = () => (
  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 12a9 9 0 0 1 15-6.7L21 8M21 3v5h-5" />
    <path d="M21 12a9 9 0 0 1-15 6.7L3 16M3 21v-5h5" />
  </svg>
);
const TrophyIcon = () => (
  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 21h8M12 17v4M7 4h10v4a5 5 0 0 1-10 0V4Z" />
    <path d="M5 4H3v3a3 3 0 0 0 3 3M19 4h2v3a3 3 0 0 1-3 3" />
  </svg>
);
const UserIcon = () => (
  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21a8 8 0 0 1 16 0" />
  </svg>
);
const FlameIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
    <path d="M12 2s4 5 4 9a4 4 0 1 1-8 0c0-1.5 1-3 1-3S6 11 6 14a6 6 0 1 0 12 0c0-5-6-12-6-12Z" />
  </svg>
);
const HeartIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
    <path d="M12 21s-7-4.5-9.5-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 6c-2.5 4.5-9.5 9-9.5 9Z" />
  </svg>
);
const GemIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
    <path d="M6 3h12l4 6-10 12L2 9l4-6Z" />
  </svg>
);

export default function Layout() {
  const { pathname } = useLocation();
  const hideChrome =
    pathname.startsWith("/lesson/") ||
    pathname.startsWith("/auth/") ||
    pathname === "/welcome";

  const xp = useStore((s) => s.xpTotal);
  const streak = useStore((s) => s.streakCount);
  const hearts = useStore((s) => s.hearts);
  const gems = useStore((s) => s.gems);

  return (
    <div className="min-h-screen flex flex-col">
      {!hideChrome && (
        <header className="sticky top-0 z-30 bg-white/85 dark:bg-berkut-bg-dark/85 backdrop-blur border-b border-berkut-border dark:border-berkut-border-dark">
          <div className="mx-auto max-w-3xl px-4 py-3 flex items-center gap-3">
            <NavLink to="/" className="flex items-center gap-2 font-extrabold tracking-tight">
              <span className="text-2xl">🦅</span>
              <span className="text-lg">Berkut</span>
            </NavLink>
            <div className="ml-auto flex items-center gap-3 text-sm font-bold">
              <span className="chip bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-200">
                <FlameIcon /> {streak}
              </span>
              <span className="chip bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-200">
                <HeartIcon /> {hearts}
              </span>
              <span className="chip bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-200">
                <GemIcon /> {gems}
              </span>
              <span className="chip bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-200">
                ⚡ {xp}
              </span>
            </div>
          </div>
        </header>
      )}

      <main className="flex-1 pb-24 sm:pb-6">
        <Outlet />
      </main>

      {!hideChrome && (
        <nav className="fixed bottom-0 inset-x-0 z-20 bg-white dark:bg-berkut-card-dark border-t border-berkut-border dark:border-berkut-border-dark sm:hidden">
          <div className="mx-auto max-w-3xl grid grid-cols-4">
            <Tab to="/" icon={<HomeIcon />} label="Learn" />
            <Tab to="/practice" icon={<RefreshIcon />} label="Practice" />
            <Tab to="/leaderboard" icon={<TrophyIcon />} label="League" />
            <Tab to="/profile" icon={<UserIcon />} label="Profile" />
          </div>
        </nav>
      )}

      {!hideChrome && (
        <nav className="hidden sm:flex fixed left-4 top-1/2 -translate-y-1/2 flex-col gap-1 z-20 bg-white dark:bg-berkut-card-dark border-2 border-berkut-border dark:border-berkut-border-dark rounded-2xl p-2 shadow">
          <SideTab to="/" icon={<HomeIcon />} label="Learn" />
          <SideTab to="/practice" icon={<RefreshIcon />} label="Practice" />
          <SideTab to="/leaderboard" icon={<TrophyIcon />} label="League" />
          <SideTab to="/profile" icon={<UserIcon />} label="Profile" />
          <SideTab to="/settings" icon={<UserIcon />} label="Settings" />
        </nav>
      )}
    </div>
  );
}

function Tab({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) {
  return (
    <NavLink
      to={to}
      end={to === "/"}
      className={({ isActive }) =>
        `flex flex-col items-center justify-center py-3 text-xs font-semibold transition ${
          isActive
            ? "text-berkut-primary"
            : "text-berkut-muted dark:text-berkut-muted-dark"
        }`
      }
    >
      {icon}
      <span className="mt-0.5">{label}</span>
    </NavLink>
  );
}

function SideTab({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) {
  return (
    <NavLink
      to={to}
      end={to === "/"}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold transition ${
          isActive
            ? "bg-berkut-primary/10 text-berkut-primary"
            : "text-berkut-muted dark:text-berkut-muted-dark hover:bg-black/5 dark:hover:bg-white/5"
        }`
      }
    >
      {icon}
      <span>{label}</span>
    </NavLink>
  );
}
