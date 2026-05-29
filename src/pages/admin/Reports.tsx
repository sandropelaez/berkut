import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { adminFetch } from "@/admin/api";

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

const STATUS_COLOUR: Record<string, string> = {
  open: "bg-berkut-error/20 text-rose-700 dark:text-rose-200",
  resolved: "bg-berkut-success/20 text-emerald-700 dark:text-emerald-200",
  dismissed: "bg-black/10 dark:bg-white/10 text-berkut-muted dark:text-berkut-muted-dark",
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
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h1 className="text-2xl font-extrabold">Reports</h1>
        <div className="flex gap-2">
          {(["open", "resolved", "dismissed", "all"] as Filter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`text-xs uppercase tracking-wide font-bold px-3 py-1.5 rounded-full ${
                filter === f
                  ? "bg-berkut-primary text-white"
                  : "bg-black/5 dark:bg-white/5 text-berkut-muted dark:text-berkut-muted-dark"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>
      <p className="text-sm text-berkut-muted dark:text-berkut-muted-dark">
        User-submitted reports of exercise problems. Resolve once fixed, dismiss if false.
      </p>

      {loading ? (
        <div className="card text-berkut-muted dark:text-berkut-muted-dark">Loading…</div>
      ) : reports.length === 0 ? (
        <div className="card text-center py-8 text-berkut-muted dark:text-berkut-muted-dark">
          <div className="text-3xl">✨</div>
          <p className="mt-2">No {filter === "all" ? "" : filter} reports.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reports.map((r) => (
            <div key={r.id} className="card">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`chip text-xs ${STATUS_COLOUR[r.status]}`}>{r.status}</span>
                    <span className="chip bg-berkut-primary/10 text-berkut-primary text-xs">
                      {REASON_LABEL[r.reason] ?? r.reason}
                    </span>
                    {r.exercise?.type && (
                      <span className="chip bg-black/10 dark:bg-white/10 text-xs">
                        {r.exercise.type}
                      </span>
                    )}
                    {r.exercise?.confidence && r.exercise.confidence !== "high" && (
                      <span className="chip bg-berkut-gold/20 text-amber-700 dark:text-amber-200 text-xs">
                        confidence: {r.exercise.confidence}
                      </span>
                    )}
                    <span className="text-xs text-berkut-muted dark:text-berkut-muted-dark">
                      {new Date(r.created_at).toLocaleString()}
                    </span>
                  </div>

                  <div className="mt-2 text-sm">
                    <p>
                      <span className="text-berkut-muted dark:text-berkut-muted-dark">
                        Exercise:
                      </span>{" "}
                      <code className="text-xs">{r.exercise_id}</code>
                      {r.lesson_id && (
                        <>
                          {" · "}
                          <Link
                            to={`/admin/content/lessons/${r.lesson_id}`}
                            className="text-berkut-primary hover:underline"
                          >
                            open lesson →
                          </Link>
                        </>
                      )}
                    </p>
                    <p className="text-xs text-berkut-muted dark:text-berkut-muted-dark">
                      Reporter: {r.reporter_email ?? "anonymous"}
                    </p>
                  </div>

                  {r.exercise?.prompt && (
                    <pre className="mt-2 text-xs bg-berkut-bg dark:bg-berkut-bg-dark rounded-lg p-2 overflow-x-auto">
                      {JSON.stringify(r.exercise.prompt, null, 2)}
                    </pre>
                  )}

                  {r.comment && (
                    <blockquote className="mt-2 text-sm border-l-2 border-berkut-primary pl-3 italic">
                      "{r.comment}"
                    </blockquote>
                  )}
                </div>

                <div className="flex flex-col gap-2 shrink-0">
                  {r.status === "open" && (
                    <>
                      <button
                        onClick={() => update(r.id, "resolved")}
                        disabled={busyId === r.id}
                        className="btn-success text-xs"
                      >
                        Resolve
                      </button>
                      <button
                        onClick={() => update(r.id, "dismissed")}
                        disabled={busyId === r.id}
                        className="btn-outline text-xs"
                      >
                        Dismiss
                      </button>
                    </>
                  )}
                  {r.status !== "open" && (
                    <button
                      onClick={() => update(r.id, "open")}
                      disabled={busyId === r.id}
                      className="btn-outline text-xs"
                    >
                      Reopen
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
