import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminFetch } from "@/admin/api";
import RoleBadge from "@/admin/RoleBadge";
import { Card, DataTable, StatTile } from "@/components/ui";

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

const fmt = (n: number) => n.toLocaleString();

export default function AdminOverview() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    adminFetch<Stats>("/stats")
      .then(setStats)
      .catch((e) => setError(String(e)));
  }, []);

  if (error) return <p className="text-small font-semibold text-berkut-danger">{error}</p>;
  if (!stats) return <p className="text-small text-berkut-ink-muted">Loading…</p>;

  return (
    <div className="space-y-8">
      <h1 className="text-title-lg">Overview</h1>

      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatTile label="Users" value={fmt(stats.users_total)} />
        <StatTile label="Lessons done" value={fmt(stats.lessons_completed_total)} />
        <StatTile label="Active streaks" value={fmt(stats.active_streaks)} />
        <StatTile label="Verified" value={fmt(stats.verified_users)} />
      </section>

      <section className="space-y-3">
        <h2 className="text-title-sm">Activity</h2>
        <div className="grid grid-cols-3 gap-3">
          <StatTile label="Daily active" value={fmt(stats.dau)} tone="accent" />
          <StatTile label="Weekly active" value={fmt(stats.wau)} tone="accent" />
          <StatTile label="Monthly active" value={fmt(stats.mau)} tone="accent" />
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-title-sm">Recent signups</h2>
        <Card className="overflow-x-auto">
          <DataTable
            caption="Recent signups"
            columns={[
              { key: "name", header: "Name" },
              { key: "role", header: "Role" },
              { key: "joined", header: "Joined" },
              { key: "xp", header: "XP", align: "end" },
            ]}
            rows={stats.recent_signups.map((u) => ({
              id: u.user_id,
              name: <span className="font-semibold">{u.display_name}</span>,
              role: <RoleBadge role={u.role} />,
              joined: <span className="text-berkut-ink-muted">{new Date(u.created_at).toLocaleString()}</span>,
              xp: fmt(u.xp_total),
            }))}
            rowKey="id"
            onRowClick={(row) => navigate(`/admin/users/${row.id}`)}
            empty="No signups yet."
          />
        </Card>
      </section>
    </div>
  );
}
