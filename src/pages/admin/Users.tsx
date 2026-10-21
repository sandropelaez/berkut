import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminFetch } from "@/admin/api";
import RoleBadge from "@/admin/RoleBadge";
import { Card, DataTable } from "@/components/ui";

interface UserRow {
  user_id: string;
  display_name: string;
  email?: string | null;
  role: string;
  streak_count: number;
  last_active_at: string | null;
  created_at: string;
}

export default function AdminUsers() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserRow[]>([]);
  const [total, setTotal] = useState(0);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);

  function load() {
    setLoading(true);
    adminFetch<{ users: UserRow[]; total: number }>(
      `/users${q ? `?q=${encodeURIComponent(q)}` : ""}`,
    )
      .then(({ users, total }) => {
        setUsers(users);
        setTotal(total);
      })
      .finally(() => setLoading(false));
  }
  useEffect(load, [q]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-title-lg">Users</h1>
          <p className="mt-1 text-small text-berkut-ink-muted">
            {total.toLocaleString()} total · showing {users.length}
          </p>
        </div>
        <input
          type="search"
          aria-label="Search users"
          placeholder="Search by display name"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="field sm:max-w-xs"
        />
      </div>

      <Card className="overflow-x-auto">
        <DataTable
          caption="Users"
          columns={[
            { key: "name", header: "Name" },
            { key: "email", header: "Email" },
            { key: "role", header: "Role" },
            { key: "streak", header: "Streak", align: "end" },
            { key: "active", header: "Last active" },
          ]}
          rows={users.map((u) => ({
            id: u.user_id,
            name: <span className="font-semibold">{u.display_name}</span>,
            email: <span className="text-berkut-ink-muted">{u.email ?? "—"}</span>,
            role: <RoleBadge role={u.role} />,
            streak: u.streak_count,
            active: (
              <span className="text-berkut-ink-muted">
                {u.last_active_at ? new Date(u.last_active_at).toLocaleDateString() : "—"}
              </span>
            ),
          }))}
          rowKey="id"
          onRowClick={(row) => navigate(`/admin/users/${row.id}`)}
          empty={loading ? "Loading…" : "No users found."}
        />
      </Card>
    </div>
  );
}
