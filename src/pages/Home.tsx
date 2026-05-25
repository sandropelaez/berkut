import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useContentStore } from "@/store/useContentStore";
import { useStore } from "@/store/useStore";
import ScriptText from "@/components/ScriptText";

export default function Home() {
  const progress = useStore((s) => s.progress);
  const status = useContentStore((s) => s.status);
  const units = useContentStore((s) => s.units);
  const loadCourse = useContentStore((s) => s.loadCourse);
  const navigate = useNavigate();

  useEffect(() => {
    if (status === "idle") loadCourse("kk");
  }, [status, loadCourse]);

  const completedCount = Object.values(progress).filter((p) => p.completed).length;

  if (status === "loading" || status === "idle") {
    return (
      <div className="mx-auto max-w-3xl px-4 sm:pl-32 py-10 text-center">
        <div className="text-4xl animate-pulse">🦅</div>
        <p className="text-berkut-muted dark:text-berkut-muted-dark mt-3">Loading course…</p>
      </div>
    );
  }

  if (status === "error") {
    const error = useContentStore.getState().error;
    return (
      <div className="mx-auto max-w-2xl px-4 sm:pl-32 py-10">
        <div className="card border-berkut-error">
          <div className="flex items-start gap-3">
            <div className="text-3xl">⚠️</div>
            <div className="flex-1">
              <h1 className="font-extrabold text-lg">Couldn't load course content.</h1>
              {error && (
                <pre className="mt-2 text-xs bg-berkut-bg dark:bg-berkut-bg-dark rounded-lg p-2 overflow-x-auto whitespace-pre-wrap break-all">
                  {error}
                </pre>
              )}
              <div className="mt-4 text-sm text-berkut-muted dark:text-berkut-muted-dark space-y-2">
                <p>Common causes:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>The SQL migrations haven't been applied — run <code>supabase/migrations/002_admin_and_content.sql</code> and <code>003_seed_content.sql</code> in the Supabase SQL editor.</li>
                  <li>The Supabase project is paused (free tier auto-pauses after a week of inactivity).</li>
                  <li>Vercel env vars missing or stale — check <code>VITE_SUPABASE_URL</code>, <code>VITE_SUPABASE_ANON_KEY</code>.</li>
                </ul>
              </div>
              <button onClick={() => loadCourse("kk")} className="btn-primary mt-6">
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 sm:pl-32 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold">Skill Tree</h1>
          <p className="text-berkut-muted dark:text-berkut-muted-dark">
            {completedCount} lesson{completedCount === 1 ? "" : "s"} completed
          </p>
        </div>
        <Link to="/practice" className="btn-outline">
          Daily review →
        </Link>
      </div>

      <div className="space-y-6">
        {units.map((unit) => {
          const total = unit.lessons.length;
          const done = unit.lessons.filter((l) => progress[l.id]?.completed).length;
          return (
            <section key={unit.id} className="card">
              <header className="flex items-center gap-3 mb-4">
                <div className="text-3xl">{unit.emoji}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="chip bg-berkut-primary/10 text-berkut-primary uppercase tracking-wide text-xs">
                      Unit {unit.id} · {unit.cefrLevel}
                    </span>
                  </div>
                  <h2 className="text-lg font-bold mt-1">
                    <ScriptText>{unit.titleKk}</ScriptText>{" "}
                    <span className="text-berkut-muted dark:text-berkut-muted-dark font-medium text-base">
                      — {unit.titleEn}
                    </span>
                  </h2>
                </div>
                {total > 0 && (
                  <div className="text-sm font-semibold text-berkut-muted dark:text-berkut-muted-dark">
                    {done}/{total}
                  </div>
                )}
              </header>

              {total === 0 ? (
                <p className="text-sm text-berkut-muted dark:text-berkut-muted-dark">
                  {unit.description ?? "Coming soon"}
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {unit.lessons.map((lesson, idx) => {
                    const completed = progress[lesson.id]?.completed;
                    const perfectRun = progress[lesson.id]?.perfectRun;
                    const prevDone =
                      idx === 0 || progress[unit.lessons[idx - 1]!.id]?.completed;
                    const isLocked = !prevDone && !completed;
                    return (
                      <button
                        key={lesson.id}
                        onClick={() => !isLocked && navigate(`/lesson/${lesson.id}`)}
                        disabled={isLocked}
                        className={`text-left p-4 rounded-2xl border-2 transition active:scale-[0.99] ${
                          completed
                            ? "border-berkut-success bg-berkut-success/10"
                            : isLocked
                              ? "border-berkut-border dark:border-berkut-border-dark opacity-50 cursor-not-allowed"
                              : "border-berkut-primary/40 bg-white dark:bg-berkut-card-dark hover:border-berkut-primary"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`h-10 w-10 rounded-full flex items-center justify-center font-bold ${
                              completed
                                ? "bg-berkut-success text-white"
                                : isLocked
                                  ? "bg-berkut-border dark:bg-berkut-border-dark text-berkut-muted"
                                  : "bg-berkut-primary text-white"
                            }`}
                          >
                            {completed ? (perfectRun ? "★" : "✓") : isLocked ? "🔒" : lesson.order}
                          </div>
                          <div>
                            <div className="font-bold">
                              <ScriptText>{lesson.titleKk}</ScriptText>
                            </div>
                            <div className="text-sm text-berkut-muted dark:text-berkut-muted-dark">
                              {lesson.titleEn}
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {unit.culturalNote && (
                <div className="mt-4 p-3 rounded-xl bg-berkut-gold/10 text-sm border border-berkut-gold/30">
                  <span className="font-bold mr-1">Cultural note:</span>
                  {unit.culturalNote}
                </div>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
