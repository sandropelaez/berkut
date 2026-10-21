import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { adminFetch } from "@/admin/api";
import RoleBadge from "@/admin/RoleBadge";
import { Card, Field, StatTile, StatusBadge } from "@/components/ui";

interface UserDetail {
  profile: any;
  progress: any | null;
  email: string | null;
  email_confirmed: boolean;
  providers: string[];
  last_sign_in_at: string | null;
}

export default function AdminUserDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<UserDetail | null>(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    display_name: "",
    streak_count: 0,
  });
  const [err, setErr] = useState<string | null>(null);

  function load() {
    adminFetch<UserDetail>(`/users/${id}`).then((d) => {
      setData(d);
      setForm({
        display_name: d.profile.display_name,
        streak_count: d.profile.streak_count,
      });
    });
  }
  useEffect(load, [id]);

  async function save() {
    setErr(null);
    try {
      await adminFetch(`/users/${id}`, {
        method: "PATCH",
        body: JSON.stringify(form),
      });
      setEditing(false);
      load();
    } catch (e: any) {
      setErr(String(e));
    }
  }

  async function del() {
    if (!confirm(`Permanently delete ${data?.profile.display_name}? This cascades all their data and cannot be undone.`)) return;
    try {
      await adminFetch(`/users/${id}`, { method: "DELETE" });
      navigate("/admin/users", { replace: true });
    } catch (e: any) {
      setErr(String(e));
    }
  }

  if (!data) return <p className="text-small text-berkut-ink-muted">Loading…</p>;

  const count = (o: object | null | undefined) => (o ? Object.keys(o).length : 0);

  return (
    <div className="space-y-6">
      <Link to="/admin/users" className="text-small font-semibold text-berkut-turquoise-ink hover:underline">
        Back to users
      </Link>

      <header className="flex flex-wrap items-start gap-4">
        <div className="grid h-16 w-16 flex-none place-items-center rounded-full bg-berkut-turquoise-soft text-title-lg text-berkut-turquoise-ink">
          {data.profile.display_name?.charAt(0).toUpperCase() ?? "?"}
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="text-title-lg">{data.profile.display_name}</h1>
          <p className="text-small text-berkut-ink-muted">{data.email}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            <RoleBadge role={data.profile.role} />
            {data.email_confirmed ? (
              <StatusBadge tone="success" icon="check">Email confirmed</StatusBadge>
            ) : (
              <StatusBadge tone="warning">Email unconfirmed</StatusBadge>
            )}
            {data.providers.map((p) => (
              <StatusBadge key={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</StatusBadge>
            ))}
          </div>
        </div>
        <div className="flex gap-2">
          {!editing && (
            <button type="button" onClick={() => setEditing(true)} className="btn-secondary btn-sm">
              Edit
            </button>
          )}
          <button type="button" onClick={del} className="btn-danger btn-sm">
            Delete
          </button>
        </div>
      </header>

      {err && <p className="text-small font-semibold text-berkut-danger">{err}</p>}

      <Card className="space-y-4">
        <h2 className="text-title-sm">Profile</h2>
        {!editing ? (
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <StatTile label="Streak" value={`${data.profile.streak_count} days`} />
            <StatTile label="Script" value={data.profile.script_pref === "LATIN" ? "Latin" : "Cyrillic"} />
            <StatTile label="Joined" value={new Date(data.profile.created_at).toLocaleDateString()} />
            <StatTile
              label="Last active"
              value={data.profile.last_active_at ? new Date(data.profile.last_active_at).toLocaleDateString() : "—"}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Display name" value={form.display_name} onChange={(e) => setForm({ ...form, display_name: e.target.value })} />
            <Field
              label="Streak"
              type="number"
              value={String(form.streak_count)}
              onChange={(e) => setForm({ ...form, streak_count: parseInt(e.target.value, 10) || 0 })}
            />
            <div className="flex justify-end gap-2 sm:col-span-2">
              <button type="button" onClick={() => setEditing(false)} className="btn-secondary btn-sm">
                Cancel
              </button>
              <button type="button" onClick={save} className="btn-primary btn-sm">
                Save
              </button>
            </div>
          </div>
        )}
      </Card>

      <Card className="space-y-4">
        <h2 className="text-title-sm">Progress</h2>
        <div className="grid grid-cols-3 gap-3">
          <StatTile label="Lessons completed" value={count(data.progress?.completed_lessons)} />
          <StatTile label="Words in review" value={count(data.progress?.srs)} />
          <StatTile label="Badges" value={count(data.progress?.badges)} />
        </div>
      </Card>
    </div>
  );
}
