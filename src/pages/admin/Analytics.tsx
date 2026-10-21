import { useEffect, useState } from "react";
import { adminFetch } from "@/admin/api";
import { Card, StatTile } from "@/components/ui";

const pct = (part: number, whole: number) => (whole ? `${Math.round((part / whole) * 100)}%` : "—");

export default function AdminAnalytics() {
  const [stats, setStats] = useState<any>(null);
  useEffect(() => {
    adminFetch("/stats").then(setStats);
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-title-lg">Analytics</h1>
        <p className="mt-1 text-small text-berkut-ink-muted">
          Deeper drill-downs land here when the user base is big enough to warrant them. For now, see
          Overview for live counts.
        </p>
      </div>

      {stats && (
        <section className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <StatTile label="Registered → verified" value={pct(stats.verified_users, stats.users_total)} />
          <StatTile label="Users with an active streak" value={pct(stats.active_streaks, stats.users_total)} />
          <StatTile
            label="Lessons per user"
            value={stats.users_total ? (stats.lessons_completed_total / stats.users_total).toFixed(1) : "—"}
          />
          <StatTile label="Daily / monthly active" value={pct(stats.dau, stats.mau)} />
        </section>
      )}

      <Card className="space-y-3">
        <h2 className="text-title-sm">Coming in v1.4</h2>
        <ul className="list-disc space-y-1 pl-5 text-[15px] leading-[22px] text-berkut-ink-muted">
          <li>Per-lesson completion, an accuracy heatmap and average time per exercise.</li>
          <li>The hardest exercises by mistake rate.</li>
          <li>Cohort retention (day 1, day 7, day 30).</li>
          <li>SRS difficulty distribution per vocab item.</li>
          <li>Drop-off funnel: signup → first lesson → unit 1 complete.</li>
        </ul>
      </Card>
    </div>
  );
}
