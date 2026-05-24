import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { adminFetch } from "@/admin/api";

interface UserRow {
  user_id: string;
  display_name: string;
  email?: string | null;
  role: string;
  xp_total: number;
  xp_weekly: number;
  streak_count: number;
  league: string;
  last_active_at: string | null;
  created_at: string;
}

export default function AdminUsers() {
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
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-extrabold">Users</h1>
        <input
          placeholder="Search by display name…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="rounded-xl border-2 border-berkut-border dark:border-berkut-border-dark bg-white dark:bg-berkut-card-dark px-3 py-2 outline-none focus:border-berkut-primary text-sm"
        />
      </div>
      <p className="text-sm text-berkut-muted dark:text-berkut-muted-dark">
        {total} total · showing {users.length}
      </p>

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-xs uppercase tracking-wide text-berkut-muted dark:text-berkut-muted-dark">
            <tr>
              <th className="py-2">Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>XP</th>
              <th>Streak</th>
              <th>Active</th>
              <th></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-berkut-border dark:divide-berkut-border-dark">
            {loading && (
              <tr>
                <td className="py-3 text-berkut-muted dark:text-berkut-muted-dark" colSpan={7}>
                  Loading…
                </td>
              </tr>
            )}
            {!loading && users.length === 0 && (
              <tr>
                <td className="py-3 text-berkut-muted dark:text-berkut-muted-dark" colSpan={7}>
                  No users.
                </td>
              </tr>
            )}
            {users.map((u) => (
              <tr key={u.user_id} className="hover:bg-black/5 dark:hover:bg-white/5">
                <td className="py-2 font-bold">{u.display_name}</td>
                <td className="text-berkut-muted dark:text-berkut-muted-dark">{u.email ?? "—"}</td>
                <td>
                  {u.role !== "user" ? (
                    <span className="chip bg-berkut-gold/20 text-amber-700 dark:text-amber-200 text-xs">
                      {u.role}
                    </span>
                  ) : (
                    <span className="text-berkut-muted dark:text-berkut-muted-dark text-xs">user</span>
                  )}
                </td>
                <td>{u.xp_total}</td>
                <td>{u.streak_count}🔥</td>
                <td className="text-berkut-muted dark:text-berkut-muted-dark text-xs">
                  {u.last_active_at ? new Date(u.last_active_at).toLocaleDateString() : "—"}
                </td>
                <td className="text-right">
                  <Link
                    to={`/admin/users/${u.user_id}`}
                    className="text-berkut-primary hover:underline text-xs font-bold"
                  >
                    View →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
