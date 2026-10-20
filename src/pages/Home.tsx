import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useContentStore } from "@/store/useContentStore";
import { useStore } from "@/store/useStore";
import ScriptText from "@/components/ScriptText";
import { CheckIcon, LockIcon, Ornament, StarIcon, SunLoader } from "@/components/ui";

type NodeState = "current" | "open" | "done" | "perfect" | "locked";

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
    return <SunLoader label="Loading course…" />;
  }

  if (status === "error") {
    const error = useContentStore.getState().error;
    return (
      <div className="mx-auto max-w-content px-4 py-10">
        <div className="card">
          <h1 className="text-xl">Couldn't load course content.</h1>
          {error && (
            <pre className="mt-3 text-xs bg-berkut-sunk rounded-lg p-2 overflow-x-auto whitespace-pre-wrap break-all">
              {error}
            </pre>
          )}
          <div className="mt-4 text-sm text-berkut-muted space-y-2">
            <p>Common causes:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>The SQL migrations haven't been applied — run <code>supabase/migrations/002_admin_and_content.sql</code> and <code>003_seed_content.sql</code> in the Supabase SQL editor.</li>
              <li>The Supabase project is paused (free tier auto-pauses after a week of inactivity).</li>
              <li>Vercel env vars missing or stale — check <code>VITE_SUPABASE_URL</code>, <code>VITE_SUPABASE_ANON_KEY</code>.</li>
            </ul>
          </div>
          <button onClick={() => loadCourse("kk")} className="btn-primary mt-6 w-full">
            Retry
          </button>
        </div>
      </div>
    );
  }

  // The first unlocked, unfinished lesson on the whole path is "current".
  let currentId: string | null = null;
  for (const unit of units) {
    for (let i = 0; i < unit.lessons.length && !currentId; i++) {
      const l = unit.lessons[i]!;
      const prevDone = i === 0 || progress[unit.lessons[i - 1]!.id]?.completed;
      if (!progress[l.id]?.completed && prevDone) currentId = l.id;
    }
    if (currentId) break;
  }

  return (
    <div className="mx-auto max-w-content px-4 pt-4 pb-6">
      <div className="flex items-end justify-between gap-3 mb-6">
        <div>
          <h1 className="text-[26px] leading-8">Оқу жолы</h1>
          <p className="text-berkut-muted text-[15px]">
            Your path · {completedCount} lesson{completedCount === 1 ? "" : "s"} done
          </p>
        </div>
        <Link to="/practice" className="btn-secondary btn-sm">
          Daily review
        </Link>
      </div>

      <div className="space-y-8">
        {units.map((unit) => {
          const total = unit.lessons.length;
          const done = unit.lessons.filter((l) => progress[l.id]?.completed).length;
          return (
            <section key={unit.id} className="card">
              <header className="flex items-end gap-3 mb-3">
                <div className="flex-1 min-w-0 flex flex-col gap-1">
                  <span className="eyebrow">
                    Unit {unit.id} · {unit.cefrLevel}
                  </span>
                  <h2 className="text-[19px] leading-[26px] font-medium">
                    <ScriptText>{unit.titleKk}</ScriptText>
                  </h2>
                  <span className="text-[15px] text-berkut-muted">{unit.titleEn}</span>
                </div>
                {total > 0 && (
                  <span className="font-display font-semibold text-sm tabular-nums text-berkut-muted">
                    {done}/{total}
                  </span>
                )}
              </header>

              {total === 0 ? (
                <p className="text-sm text-berkut-muted">{unit.description ?? "Coming soon"}</p>
              ) : (
                <ol className="-mx-2 flex flex-col gap-1">
                  {unit.lessons.map((lesson, idx) => {
                    const p = progress[lesson.id];
                    const prevDone = idx === 0 || progress[unit.lessons[idx - 1]!.id]?.completed;
                    const state: NodeState = p?.completed
                      ? p.perfectRun
                        ? "perfect"
                        : "done"
                      : lesson.id === currentId
                        ? "current"
                        : prevDone
                          ? "open"
                          : "locked";
                    return (
                      <li key={lesson.id}>
                        <LessonNode
                          state={state}
                          index={idx + 1}
                          titleKk={<ScriptText>{lesson.titleKk}</ScriptText>}
                          titleEn={lesson.titleEn}
                          onClick={() => navigate(`/lesson/${lesson.id}`)}
                        />
                      </li>
                    );
                  })}
                </ol>
              )}

              {unit.culturalNote && (
                <aside className="mt-4 rounded-sheet bg-berkut-gold-soft p-4 flex flex-col gap-2">
                  <Ornament id={`u${unit.id}`} />
                  <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-berkut-gold-ink">
                    Cultural note
                  </span>
                  <p className="text-[15px] leading-[22px]">{unit.culturalNote}</p>
                </aside>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}

const DISC: Record<NodeState, string> = {
  current: "bg-berkut-sky text-berkut-on-sky shadow-[0_0_0_5px_rgb(var(--bk-sky-soft))]",
  open: "bg-berkut-raised text-berkut-sky-ink shadow-[inset_0_0_0_2px_rgb(var(--bk-sky))]",
  done: "bg-berkut-success text-berkut-on-success",
  perfect: "bg-berkut-gold text-berkut-on-gold shadow-[0_0_0_5px_rgb(var(--bk-gold-soft))]",
  locked: "bg-berkut-sunk text-berkut-muted shadow-[inset_0_0_0_1.5px_rgb(var(--bk-line))]",
};

function LessonNode({
  state,
  index,
  titleKk,
  titleEn,
  onClick,
}: {
  state: NodeState;
  index: number;
  titleKk: React.ReactNode;
  titleEn: string;
  onClick: () => void;
}) {
  const locked = state === "locked";
  return (
    <button
      type="button"
      onClick={locked ? undefined : onClick}
      disabled={locked}
      className="flex w-full min-h-[72px] items-center gap-4 rounded-tile py-2 pl-2 pr-3 text-left transition enabled:hover:bg-berkut-sunk disabled:cursor-not-allowed"
    >
      <span className={`grid h-14 w-14 flex-none place-items-center rounded-full font-display text-lg font-semibold ${DISC[state]}`}>
        {state === "done" ? (
          <CheckIcon className="h-6 w-6" />
        ) : state === "perfect" ? (
          <StarIcon className="h-6 w-6" />
        ) : locked ? (
          <LockIcon className="h-6 w-6" />
        ) : (
          index
        )}
      </span>
      <span className={`flex min-w-0 flex-col gap-0.5 ${locked ? "opacity-60" : ""}`}>
        <span className="font-display font-medium text-base leading-[22px]">{titleKk}</span>
        <span className="text-[13px] font-medium leading-[18px] text-berkut-muted">{titleEn}</span>
      </span>
      {state === "current" && (
        <span className="ml-auto text-[11px] font-bold uppercase tracking-[0.12em] text-berkut-sky-ink">Start</span>
      )}
      {state === "perfect" && (
        <span className="ml-auto text-[11px] font-bold uppercase tracking-[0.12em] text-berkut-gold-ink">Perfect</span>
      )}
    </button>
  );
}
