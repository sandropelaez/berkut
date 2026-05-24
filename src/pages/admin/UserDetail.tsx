import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { adminFetch } from "@/admin/api";

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
    xp_total: 0,
    streak_count: 0,
    gems: 0,
  });
  const [err, setErr] = useState<string | null>(null);

  function load() {
    adminFetch<UserDetail>(`/users/${id}`).then((d) => {
      setData(d);
      setForm({
        display_name: d.profile.display_name,
        xp_total: d.profile.xp_total,
        streak_count: d.profile.streak_count,
        gems: d.profile.gems,
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

  if (!data) return <div>Loading…</div>;

  return (
    <div className="space-y-6">
      <Link to="/admin/users" className="text-sm text-berkut-primary hover:underline">
        ← Back to users
      </Link>

      <header className="flex items-start gap-4">
        <div className="h-16 w-16 rounded-full bg-berkut-primary text-white flex items-center justify-center text-2xl font-extrabold">
          {data.profile.display_name?.charAt(0).toUpperCase() ?? "?"}
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-extrabold">{data.profile.display_name}</h1>
          <p className="text-berkut-muted dark:text-berkut-muted-dark text-sm">{data.email}</p>
          <div className="flex gap-2 mt-2">
            {data.profile.role !== "user" && (
              <span className="chip bg-berkut-gold/20 text-amber-700 dark:text-amber-200 text-xs">
                {data.profile.role}
              </span>
            )}
            <span className={`chip text-xs ${data.email_confirmed ? "bg-berkut-success/20 text-emerald-700 dark:text-emerald-200" : "bg-berkut-error/20 text-rose-700 dark:text-rose-200"}`}>
              {data.email_confirmed ? "verified" : "unverified"}
            </span>
            {data.providers.map((p) => (
              <span key={p} className="chip bg-black/10 dark:bg-white/10 text-xs">{p}</span>
            ))}
          </div>
        </div>
        <div className="flex gap-2">
          {!editing && (
            <button onClick={() => setEditing(true)} className="btn-outline text-sm">
              Edit
            </button>
          )}
          <button onClick={del} className="btn-error text-sm">
            Delete
          </button>
        </div>
      </header>

      {err && <div className="text-berkut-error font-bold text-sm">{err}</div>}

      <section className="card space-y-3">
        <h2 className="font-bold">Profile</h2>
        {!editing ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
            <Stat label="XP total" value={data.profile.xp_total} />
            <Stat label="XP weekly" value={data.profile.xp_weekly} />
            <Stat label="Streak" value={`${data.profile.streak_count}🔥`} />
            <Stat label="Gems" value={`${data.profile.gems}💎`} />
            <Stat label="League" value={data.profile.league} />
            <Stat label="Script" value={data.profile.script_pref} />
            <Stat label="Created" value={new Date(data.profile.created_at).toLocaleDateString()} />
            <Stat label="Last active" value={data.profile.last_active_at ? new Date(data.profile.last_active_at).toLocaleDateString() : "—"} />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="Display name" value={form.display_name} onChange={(v) => setForm({ ...form, display_name: v })} />
            <Field label="XP total" type="number" value={String(form.xp_total)} onChange={(v) => setForm({ ...form, xp_total: parseInt(v, 10) || 0 })} />
            <Field label="Streak" type="number" value={String(form.streak_count)} onChange={(v) => setForm({ ...form, streak_count: parseInt(v, 10) || 0 })} />
            <Field label="Gems" type="number" value={String(form.gems)} onChange={(v) => setForm({ ...form, gems: parseInt(v, 10) || 0 })} />
            <div className="sm:col-span-2 flex gap-2 justify-end">
              <button onClick={() => setEditing(false)} className="btn-outline text-sm">Cancel</button>
              <button onClick={save} className="btn-primary text-sm">Save</button>
            </div>
          </div>
        )}
      </section>

      <section className="card">
        <h2 className="font-bold mb-3">Progress</h2>
        <div className="text-sm">
          <p>
            Lessons completed:{" "}
            <strong>
              {data.progress?.completed_lessons
                ? Object.keys(data.progress.completed_lessons).length
                : 0}
            </strong>
          </p>
          <p>SRS items: <strong>{data.progress?.srs ? Object.keys(data.progress.srs).length : 0}</strong></p>
          <p>Badges: <strong>{data.progress?.badges ? Object.keys(data.progress.badges).length : 0}</strong></p>
        </div>
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl bg-berkut-bg dark:bg-berkut-bg-dark p-3 border border-berkut-border dark:border-berkut-border-dark">
      <div className="text-xs uppercase tracking-wide text-berkut-muted dark:text-berkut-muted-dark">{label}</div>
      <div className="text-base font-extrabold mt-1">{value}</div>
    </div>
  );
}

function Field({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <label className="block text-sm font-semibold">
      {label}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-xl border-2 border-berkut-border dark:border-berkut-border-dark bg-white dark:bg-berkut-card-dark px-3 py-2 outline-none focus:border-berkut-primary"
      />
    </label>
  );
}
