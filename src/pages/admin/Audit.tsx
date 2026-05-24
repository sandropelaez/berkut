import { useEffect, useState } from "react";
import { adminFetch } from "@/admin/api";

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
    <div className="space-y-4">
      <h1 className="text-2xl font-extrabold">Audit log</h1>
      <p className="text-sm text-berkut-muted dark:text-berkut-muted-dark">
        Every admin write logged here. Append-only.
      </p>

      <div className="card divide-y divide-berkut-border dark:divide-berkut-border-dark">
        {rows.length === 0 && (
          <p className="py-3 text-berkut-muted dark:text-berkut-muted-dark text-sm">
            No events yet.
          </p>
        )}
        {rows.map((r) => (
          <div key={r.id} className="py-3">
            <button
              onClick={() => setExpanded(expanded === r.id ? null : r.id)}
              className="w-full text-left flex items-center gap-3 text-sm"
            >
              <span className="chip bg-berkut-primary/10 text-berkut-primary text-xs">
                {r.action}
              </span>
              <span className="text-berkut-muted dark:text-berkut-muted-dark flex-1">
                {r.actor_email ?? "unknown"} → {r.target_type ?? "—"}/{r.target_id ?? "—"}
              </span>
              <span className="text-xs text-berkut-muted dark:text-berkut-muted-dark">
                {new Date(r.created_at).toLocaleString()}
              </span>
            </button>
            {expanded === r.id && (
              <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-3">
                {r.before_state && (
                  <div>
                    <div className="text-xs uppercase font-bold text-berkut-muted dark:text-berkut-muted-dark mb-1">
                      Before
                    </div>
                    <pre className="text-xs bg-berkut-bg dark:bg-berkut-bg-dark rounded-lg p-2 overflow-x-auto">
                      {JSON.stringify(r.before_state, null, 2)}
                    </pre>
                  </div>
                )}
                {r.after_state && (
                  <div>
                    <div className="text-xs uppercase font-bold text-berkut-muted dark:text-berkut-muted-dark mb-1">
                      After
                    </div>
                    <pre className="text-xs bg-berkut-bg dark:bg-berkut-bg-dark rounded-lg p-2 overflow-x-auto">
                      {JSON.stringify(r.after_state, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
