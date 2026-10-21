import { useEffect, useState } from "react";
import { adminFetch } from "@/admin/api";
import { Card, StatusBadge } from "@/components/ui";

interface AuditRow {
  id: number;
  actor_email: string | null;
  action: string;
  target_type: string | null;
  target_id: string | null;
  before_state: any;
  after_state: any;
  metadata: any;
  created_at: string;
}

export default function AdminAudit() {
  const [rows, setRows] = useState<AuditRow[]>([]);
  const [expanded, setExpanded] = useState<number | null>(null);

  useEffect(() => {
    adminFetch<AuditRow[]>("/audit").then(setRows);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-title-lg">Audit log</h1>
        <p className="mt-1 text-small text-berkut-ink-muted">Every admin change, in order. Append-only.</p>
      </div>

      <Card className="divide-y divide-berkut-line py-2">
        {rows.length === 0 && <p className="py-6 text-center text-berkut-ink-muted">No events yet.</p>}
        {rows.map((r) => (
          <div key={r.id} className="py-1">
            <button
              type="button"
              onClick={() => setExpanded(expanded === r.id ? null : r.id)}
              aria-expanded={expanded === r.id}
              className="-mx-3 flex w-[calc(100%+24px)] flex-wrap items-center gap-3 rounded-xl px-3 py-3 text-left text-[15px] leading-[22px] hover:bg-berkut-surface"
            >
              <StatusBadge tone="info">{r.action}</StatusBadge>
              <span className="min-w-0 flex-1 truncate text-berkut-ink-muted">
                {r.actor_email ?? "Unknown"} → {r.target_type ?? "—"}/{r.target_id ?? "—"}
              </span>
              <span className="text-caption text-berkut-ink-muted">{new Date(r.created_at).toLocaleString()}</span>
            </button>
            {expanded === r.id && (
              <div className="grid grid-cols-1 gap-3 pb-3 md:grid-cols-2">
                {r.before_state && <StateBlock title="Before" value={r.before_state} />}
                {r.after_state && <StateBlock title="After" value={r.after_state} />}
              </div>
            )}
          </div>
        ))}
      </Card>
    </div>
  );
}

function StateBlock({ title, value }: { title: string; value: unknown }) {
  return (
    <div className="space-y-1">
      <div className="text-small text-berkut-ink-muted">{title}</div>
      <pre className="overflow-x-auto rounded-xl bg-berkut-surface p-3 text-xs">{JSON.stringify(value, null, 2)}</pre>
    </div>
  );
}
