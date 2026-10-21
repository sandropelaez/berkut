import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { adminFetch } from "@/admin/api";
import { Card, Icon, StatusBadge, type BadgeTone } from "@/components/ui";

interface Report {
  id: number;
  exercise_id: string;
  lesson_id: string | null;
  reporter_email: string | null;
  reason: string;
  comment: string | null;
  status: "open" | "resolved" | "dismissed";
  admin_notes: string | null;
  resolved_at: string | null;
  created_at: string;
  exercise: {
    id: string;
    lesson_id: string;
    type: string;
    prompt: any;
    status: string;
    confidence: string;
  } | null;
}

type Filter = "open" | "resolved" | "dismissed" | "all";

const FILTERS: Array<{ id: Filter; label: string }> = [
  { id: "open", label: "Open" },
  { id: "resolved", label: "Resolved" },
  { id: "dismissed", label: "Dismissed" },
  { id: "all", label: "All" },
];

const REASON_LABEL: Record<string, string> = {
  wrong_translation: "Wrong translation",
  grammar_error: "Grammar error",
  typo: "Typo",
  bad_audio: "Bad audio",
  too_hard: "Too hard",
  too_easy: "Too easy",
  offensive: "Offensive",
  other: "Other",
};

// Open reports need attention (warning); resolved is done; dismissed is settled.
const STATUS: Record<Report["status"], { label: string; tone: BadgeTone }> = {
  open: { label: "Open", tone: "warning" },
  resolved: { label: "Resolved", tone: "success" },
  dismissed: { label: "Dismissed", tone: "neutral" },
};

export default function AdminReports() {
  const [filter, setFilter] = useState<Filter>("open");
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<number | null>(null);

  function load() {
    setLoading(true);
    adminFetch<Report[]>(`/reports?status=${filter}`)
      .then(setReports)
      .finally(() => setLoading(false));
  }
  useEffect(load, [filter]);

  async function update(id: number, status: "resolved" | "dismissed" | "open") {
    setBusyId(id);
    try {
      await adminFetch(`/reports/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      load();
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-title-lg">Reports</h1>
          <p className="mt-1 text-small text-berkut-ink-muted">
            Problems learners reported in exercises. Resolve once fixed; dismiss if it isn't a problem.
          </p>
        </div>
        <div className="flex gap-2" role="group" aria-label="Filter reports">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              aria-pressed={filter === f.id}
              className={`h-9 rounded-full px-4 text-small font-semibold transition-colors ${
                filter === f.id
                  ? "bg-berkut-turquoise-soft text-berkut-turquoise-ink"
                  : "bg-berkut-surface text-berkut-ink-muted hover:text-berkut-ink"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p className="text-small text-berkut-ink-muted">Loading…</p>
      ) : reports.length === 0 ? (
        <Card className="flex flex-col items-center gap-3 py-10 text-center">
          <span className="grid h-12 w-12 place-items-center rounded-full bg-berkut-success-soft text-berkut-success">
            <Icon name="check" />
          </span>
          <p className="text-body text-berkut-ink-muted">
            No {filter === "all" ? "" : `${filter} `}reports.
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {reports.map((r) => (
            <Card key={r.id}>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0 flex-1 space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusBadge tone={STATUS[r.status].tone}>{STATUS[r.status].label}</StatusBadge>
                    <StatusBadge tone="info">{REASON_LABEL[r.reason] ?? r.reason}</StatusBadge>
                    {r.exercise?.type && <StatusBadge>{r.exercise.type}</StatusBadge>}
                    {r.exercise?.confidence && r.exercise.confidence !== "high" && (
                      <StatusBadge tone="warning">{r.exercise.confidence} confidence</StatusBadge>
                    )}
                    <span className="text-caption text-berkut-ink-muted">
                      {new Date(r.created_at).toLocaleString()}
                    </span>
                  </div>

                  <div className="text-[15px] leading-[22px]">
                    <p>
                      <span className="text-berkut-ink-muted">Exercise </span>
                      <code className="text-[13px]">{r.exercise_id}</code>
                      {r.lesson_id && (
                        <>
                          {" · "}
                          <Link
                            to={`/admin/content/lessons/${r.lesson_id}`}
                            className="font-semibold text-berkut-turquoise-ink hover:underline"
                          >
                            Open lesson
                          </Link>
                        </>
                      )}
                    </p>
                    <p className="text-caption text-berkut-ink-muted">
                      Reported by {r.reporter_email ?? "an anonymous learner"}
                    </p>
                  </div>

                  {r.comment && (
                    <p className="rounded-tile bg-berkut-surface px-4 py-3 text-[15px] leading-[22px]">
                      “{r.comment}”
                    </p>
                  )}

                  {r.exercise?.prompt && (
                    <pre className="overflow-x-auto rounded-xl bg-berkut-surface p-3 text-xs">
                      {JSON.stringify(r.exercise.prompt, null, 2)}
                    </pre>
                  )}
                </div>

                <div className="flex shrink-0 flex-col gap-2">
                  {r.status === "open" ? (
                    <>
                      <button
                        type="button"
                        onClick={() => update(r.id, "resolved")}
                        disabled={busyId === r.id}
                        className="btn-success btn-sm"
                      >
                        <Icon name="check" size={18} /> Resolve
                      </button>
                      <button
                        type="button"
                        onClick={() => update(r.id, "dismissed")}
                        disabled={busyId === r.id}
                        className="btn-secondary btn-sm"
                      >
                        Dismiss
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => update(r.id, "open")}
                      disabled={busyId === r.id}
                      className="btn-secondary btn-sm"
                    >
                      Reopen
                    </button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
