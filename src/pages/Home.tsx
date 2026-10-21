import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useContentStore } from "@/store/useContentStore";
import { useStore } from "@/store/useStore";
import ScriptText from "@/components/ScriptText";
import { Icon, Loader, Tag } from "@/components/ui";

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
    return <Loader label="Loading course…" />;
  }

  if (status === "error") {
    const error = useContentStore.getState().error;
    return (
      <div className="mx-auto max-w-content px-6 py-10">
        <div className="card">
          <h1 className="text-title-md">Couldn't load course content.</h1>
          {error && (
            <pre className="mt-3 text-xs bg-berkut-surface rounded-xl p-3 overflow-x-auto whitespace-pre-wrap break-all">
              {error}
            </pre>
          )}
          <div className="mt-4 text-sm text-berkut-ink-muted space-y-2">
            <p>Common causes:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>The SQL migrations haven't been applied — run <code>supabase/migrations/002_admin_and_content.sql</code> and <code>003_seed_content.sql</code> in the Supabase SQL editor.</li>
              <li>The Supabase project is paused (free tier auto-pauses after a week of inactivity).</li>
              <li>Vercel env vars missing or stale — check <code>VITE_SUPABASE_URL</code>, <code>VITE_SUPABASE_ANON_KEY</code>.</li>
            </ul>
          </div>
          <button onClick={() => loadCourse("kk")} className="btn-primary btn-block mt-6">
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
    <div className="mx-auto max-w-content px-6 pt-4 pb-8">
      <div className="flex items-end justify-between gap-3 mb-8">
        <div>
          <h1 className="text-title-lg">
            <ScriptText>Оқу жолы</ScriptText>
          </h1>
          <p className="text-small text-berkut-ink-muted mt-1">
            Your path · {completedCount} lesson{completedCount === 1 ? "" : "s"} done
          </p>
        </div>
        <Link to="/practice" className="btn-secondary px-5">
          Daily review
        </Link>
      </div>

      <div className="space-y-8">
        {units.map((unit) => {
          const total = unit.lessons.length;
          const done = unit.lessons.filter((l) => progress[l.id]?.completed).length;
          return (
            <section key={unit.id} className="card">
              <header className="mb-4 flex flex-col gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <Tag>Unit {unit.id}</Tag>
                  <Tag>{unit.cefrLevel}</Tag>
                  {total > 0 && (
                    <span className="ml-auto text-small font-semibold tabular-nums text-berkut-ink-muted">
                      {done}/{total}
                    </span>
                  )}
                </div>
                <div className="flex flex-col gap-1">
                  <h2 className="text-title-md">
                    <ScriptText>{unit.titleKk}</ScriptText>
                  </h2>
                  <span className="text-small text-berkut-ink-muted">{unit.titleEn}</span>
                </div>
              </header>

              {total === 0 ? (
                <p className="text-small text-berkut-ink-muted">{unit.description ?? "Coming soon"}</p>
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
                <aside className="mt-4 rounded-tile bg-berkut-surface p-5 flex flex-col gap-1">
                  <span className="text-small font-semibold text-berkut-turquoise-ink">Cultural note</span>
                  <p className="text-[15px] leading-[23px]">{unit.culturalNote}</p>
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
  current: "bg-berkut-turquoise text-berkut-on-turquoise shadow-[0_0_0_5px_rgb(var(--bk-turquoise-soft))]",
  open: "bg-berkut-turquoise-soft text-berkut-turquoise-ink",
  done: "bg-berkut-success-soft text-berkut-success",
  perfect: "bg-berkut-sun text-berkut-on-sun shadow-[0_0_0_5px_rgb(var(--bk-sun-soft))]",
  locked: "bg-berkut-surface text-berkut-ink-muted",
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
      className="flex w-full min-h-[72px] items-center gap-4 rounded-tile py-2 pl-2 pr-4 text-left transition enabled:hover:bg-berkut-surface disabled:cursor-not-allowed"
    >
      <span className={`grid h-14 w-14 flex-none place-items-center rounded-full text-title-sm tabular-nums ${DISC[state]}`}>
        {state === "done" ? (
          <Icon name="check" title="Done" />
        ) : state === "perfect" ? (
          <Icon name="star" title="Perfect" />
        ) : locked ? (
          <Icon name="lock" title="Locked" />
        ) : (
          index
        )}
      </span>
      <span className={`flex min-w-0 flex-col gap-0.5 ${locked ? "opacity-60" : ""}`}>
        <span className="text-option">{titleKk}</span>
        <span className="text-caption text-berkut-ink-muted">{titleEn}</span>
      </span>
      {state === "current" && (
        <span className="ml-auto text-small font-semibold text-berkut-turquoise-ink">Start</span>
      )}
      {state === "perfect" && (
        <span className="ml-auto text-small font-semibold text-berkut-sun-ink">Perfect</span>
      )}
    </button>
  );
}
