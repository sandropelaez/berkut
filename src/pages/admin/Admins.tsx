import { useEffect, useState } from "react";
import { adminFetch } from "@/admin/api";
import RoleBadge from "@/admin/RoleBadge";
import { useAuth } from "@/core/useAuth";
import { Button, Card, DataTable, Field } from "@/components/ui";

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
      setInfo(`${email} is now ${grantRole === "admin" ? "an admin" : "a content editor"}.`);
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
    <div className="space-y-8">
      <h1 className="text-title-lg">Admins</h1>

      {canGrant ? (
        <Card>
          <form onSubmit={grant} className="space-y-4">
            <div>
              <h2 className="text-title-sm">Grant access</h2>
              <p className="mt-1 text-small text-berkut-ink-muted">
                The person must already have an account. Only super admins can grant or revoke admin access.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
              <Field
                label="Email"
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1"
              />
              <label className="flex flex-col gap-2">
                <span className="text-small text-berkut-ink-muted">Role</span>
                <select value={grantRole} onChange={(e) => setGrantRole(e.target.value as any)} className="field pr-10">
                  <option value="admin">Admin</option>
                  <option value="content_editor">Content editor</option>
                </select>
              </label>
              <Button type="submit">Grant access</Button>
            </div>
            {info && <p className="text-small font-semibold text-berkut-success">{info}</p>}
            {err && <p className="text-small font-semibold text-berkut-danger">{err}</p>}
          </form>
        </Card>
      ) : (
        <Card className="text-small text-berkut-ink-muted">
          Only super admins can grant or revoke admin access. You can still see the list.
        </Card>
      )}

      <Card className="overflow-x-auto">
        <DataTable
          caption="Admins"
          columns={[
            { key: "name", header: "Name" },
            { key: "email", header: "Email" },
            { key: "role", header: "Role" },
            { key: "joined", header: "Joined" },
            { key: "actions", header: "", align: "end" },
          ]}
          rows={rows.map((r) => ({
            id: r.user_id,
            name: <span className="font-semibold">{r.display_name}</span>,
            email: <span className="text-berkut-ink-muted">{r.email ?? "—"}</span>,
            role: <RoleBadge role={r.role} />,
            joined: <span className="text-berkut-ink-muted">{new Date(r.created_at).toLocaleDateString()}</span>,
            actions:
              canGrant && r.role !== "super_admin" ? (
                <button
                  type="button"
                  onClick={() => revoke(r.user_id, r.display_name)}
                  className="text-small font-semibold text-berkut-danger hover:underline"
                >
                  Revoke
                </button>
              ) : null,
          }))}
          rowKey="id"
          empty="No admins yet."
        />
      </Card>
    </div>
  );
}
