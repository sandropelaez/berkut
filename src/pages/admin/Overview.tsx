import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { adminFetch } from "@/admin/api";

interface Stats {
  users_total: number;
  dau: number;
  wau: number;
  mau: number;
  verified_users: number;
  lessons_completed_total: number;
  active_streaks: number;
  recent_signups: Array<{
    user_id: string;
    display_name: string;
    created_at: string;
    xp_total: number;
    role: string;
  }>;
}

export default function AdminOverview() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    adminFetch<Stats>("/stats")
      .then(setStats)
      .catch((e) => setError(String(e)));
  }, []);

  if (error) return <div className="text-berkut-error font-bold">{error}</div>;
  if (!stats)
    return <div className="text-berkut-muted dark:text-berkut-muted-dark">Loading…</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold">Overview</h1>

      <section className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Stat label="Users" value={stats.users_total} />
        <Stat label="Lessons done" value={stats.lessons_completed_total} />
        <Stat label="Active streaks" value={stats.active_streaks} />
        <Stat label="Verified" value={stats.verified_users} />
      </section>

      <section>
        <h2 className="text-sm font-bold uppercase tracking-wide text-berkut-muted dark:text-berkut-muted-dark mb-2">
          Activity
        </h2>
        <div className="grid grid-cols-3 gap-3">
          <Stat label="DAU" value={stats.dau} tone="primary" />
          <Stat label="WAU" value={stats.wau} tone="primary" />
          <Stat label="MAU" value={stats.mau} tone="primary" />
        </div>
      </section>

      <section>
        <h2 className="text-sm font-bold uppercase tracking-wide text-berkut-muted dark:text-berkut-muted-dark mb-2">
          Recent signups
        </h2>
        <div className="card divide-y divide-berkut-border dark:divide-berkut-border-dark">
          {stats.recent_signups.length === 0 && (
            <p className="text-berkut-muted dark:text-berkut-muted-dark text-sm">None yet.</p>
          )}
          {stats.recent_signups.map((u) => (
            <Link
              key={u.user_id}
              to={`/admin/users/${u.user_id}`}
              className="flex items-center gap-3 py-2 hover:bg-black/5 dark:hover:bg-white/5 -mx-2 px-2 rounded"
            >
              <div className="flex-1">
                <div className="font-bold">{u.display_name}</div>
                <div className="text-xs text-berkut-muted dark:text-berkut-muted-dark">
                  {new Date(u.created_at).toLocaleString()}
                  {u.role !== "user" && (
                    <span className="ml-2 chip bg-berkut-gold/20 text-amber-700 dark:text-amber-200 text-xs">
                      {u.role}
                    </span>
                  )}
                </div>
              </div>
              <div className="text-sm font-semibold">⚡ {u.xp_total}</div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

function Stat({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: number | string;
  tone?: "default" | "primary";
}) {
  return (
    <div
      className={`rounded-2xl p-4 border-2 ${
        tone === "primary"
          ? "border-berkut-primary bg-berkut-primary/5"
          : "border-berkut-border dark:border-berkut-border-dark bg-white dark:bg-berkut-card-dark"
      }`}
    >
      <div className="text-xs uppercase font-bold text-berkut-muted dark:text-berkut-muted-dark">
        {label}
      </div>
      <div className="text-2xl font-extrabold mt-1">{value}</div>
    </div>
  );
}
