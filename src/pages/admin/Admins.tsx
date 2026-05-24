import { useEffect, useState } from "react";
import { adminFetch } from "@/admin/api";
import { useAuth } from "@/core/useAuth";

interface AdminRow {
  user_id: string;
  display_name: string;
  email: string | null;
  role: string;
  created_at: string;
  last_active_at: string | null;
}

export default function AdminAdmins() {
  const { role: myRole } = useAuth();
  const [rows, setRows] = useState<AdminRow[]>([]);
  const [email, setEmail] = useState("");
  const [grantRole, setGrantRole] = useState<"admin" | "content_editor">("admin");
  const [err, setErr] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  function load() {
    adminFetch<AdminRow[]>("/admins").then(setRows);
  }
  useEffect(load, []);

  async function grant(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setInfo(null);
    try {
      await adminFetch("/admins", {
        method: "POST",
        body: JSON.stringify({ email, role: grantRole }),
      });
      setInfo(`${email} is now ${grantRole}`);
      setEmail("");
      load();
    } catch (e: any) {
      setErr(String(e));
    }
  }

  async function revoke(user_id: string, name: string) {
    if (!confirm(`Revoke admin from ${name}?`)) return;
    setErr(null);
    try {
      await adminFetch("/admins", {
        method: "DELETE",
        body: JSON.stringify({ user_id }),
      });
      load();
    } catch (e: any) {
      setErr(String(e));
    }
  }

  const canGrant = myRole === "super_admin";

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold">Admins</h1>

      {canGrant ? (
        <form onSubmit={grant} className="card space-y-3">
          <h2 className="font-bold">Grant access</h2>
          <p className="text-sm text-berkut-muted dark:text-berkut-muted-dark">
            The user must have already registered. Only super-admins can grant
            or revoke admin access.
          </p>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              required
              placeholder="user@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 rounded-xl border-2 border-berkut-border dark:border-berkut-border-dark bg-white dark:bg-berkut-card-dark px-3 py-2 outline-none focus:border-berkut-primary"
            />
            <select
              value={grantRole}
              onChange={(e) => setGrantRole(e.target.value as any)}
              className="rounded-xl border-2 border-berkut-border dark:border-berkut-border-dark bg-white dark:bg-berkut-card-dark px-3 py-2"
            >
              <option value="admin">admin</option>
              <option value="content_editor">content_editor</option>
            </select>
            <button type="submit" className="btn-primary">
              Grant
            </button>
          </div>
          {info && <p className="text-sm text-berkut-success font-bold">{info}</p>}
          {err && <p className="text-sm text-berkut-error font-bold">{err}</p>}
        </form>
      ) : (
        <div className="card text-sm text-berkut-muted dark:text-berkut-muted-dark">
          Only super-admins can grant or revoke admin access. You can still view the list.
        </div>
      )}

      <section className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-xs uppercase tracking-wide text-berkut-muted dark:text-berkut-muted-dark">
            <tr>
              <th className="py-2">Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Joined</th>
              <th></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-berkut-border dark:divide-berkut-border-dark">
            {rows.map((r) => (
              <tr key={r.user_id}>
                <td className="py-2 font-bold">{r.display_name}</td>
                <td className="text-berkut-muted dark:text-berkut-muted-dark">{r.email}</td>
                <td>
                  <span
                    className={`chip text-xs ${
                      r.role === "super_admin"
                        ? "bg-berkut-gold/30 text-amber-800 dark:text-amber-100"
                        : r.role === "admin"
                          ? "bg-berkut-gold/20 text-amber-700 dark:text-amber-200"
                          : "bg-berkut-primary/20 text-berkut-primary"
                    }`}
                  >
                    {r.role}
                  </span>
                </td>
                <td className="text-xs text-berkut-muted dark:text-berkut-muted-dark">
                  {new Date(r.created_at).toLocaleDateString()}
                </td>
                <td className="text-right">
                  {canGrant && r.role !== "super_admin" ? (
                    <button
                      onClick={() => revoke(r.user_id, r.display_name)}
                      className="text-berkut-error hover:underline text-xs font-bold"
                    >
                      Revoke
                    </button>
                  ) : (
                    <span className="text-xs text-berkut-muted dark:text-berkut-muted-dark">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
