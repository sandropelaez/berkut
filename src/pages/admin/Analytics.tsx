import { useEffect, useState } from "react";
import { adminFetch } from "@/admin/api";

export default function AdminAnalytics() {
  const [stats, setStats] = useState<any>(null);
  useEffect(() => {
    adminFetch("/stats").then(setStats);
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold">Analytics</h1>
      <p className="text-sm text-berkut-muted dark:text-berkut-muted-dark">
        Deeper drill-downs land here when the user base is big enough to warrant
        them. For MVP, see Overview for live counts.
      </p>

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Card label="Conversion: registered → verified">
            {stats.users_total
              ? `${Math.round((stats.verified_users / stats.users_total) * 100)}%`
              : "—"}
          </Card>
          <Card label="Streak retention (users w/ active streak)">
            {stats.users_total
              ? `${Math.round((stats.active_streaks / stats.users_total) * 100)}%`
              : "—"}
          </Card>
          <Card label="Avg lessons per user">
            {stats.users_total
              ? (stats.lessons_completed_total / stats.users_total).toFixed(1)
              : "—"}
          </Card>
          <Card label="DAU / MAU ratio">
            {stats.mau
              ? `${Math.round((stats.dau / stats.mau) * 100)}%`
              : "—"}
          </Card>
        </div>
      )}

      <section className="card text-sm text-berkut-muted dark:text-berkut-muted-dark space-y-2">
        <h2 className="font-bold text-berkut-ink dark:text-berkut-ink-dark">Coming in v1.4</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>Per-lesson completion %, accuracy heatmap, average time-on-exercise.</li>
          <li>Top hardest exercises by mistake rate.</li>
          <li>Cohort retention chart (D1 / D7 / D30).</li>
          <li>SRS difficulty distribution per vocab item.</li>
          <li>Drop-off funnel: signup → first lesson → unit 1 complete.</li>
        </ul>
      </section>
    </div>
  );
}

function Card({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="card">
      <div className="text-xs uppercase font-bold text-berkut-muted dark:text-berkut-muted-dark">
        {label}
      </div>
      <div className="text-3xl font-extrabold mt-2">{children}</div>
    </div>
  );
}
