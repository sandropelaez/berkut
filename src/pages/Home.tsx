import { Link, useNavigate } from "react-router-dom";
import { units } from "@/data/units";
import { useStore } from "@/store/useStore";
import ScriptText from "@/components/ScriptText";

export default function Home() {
  const progress = useStore((s) => s.progress);
  const navigate = useNavigate();

  const completedCount = Object.values(progress).filter((p) => p.completed).length;

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
          const locked = unit.id > 1 && !units[unit.id - 2]?.lessons.every((l) => progress[l.id]?.completed) && total === 0;
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
                  {unit.description}
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {unit.lessons.map((lesson, idx) => {
                    const completed = progress[lesson.id]?.completed;
                    const perfectRun = progress[lesson.id]?.perfectRun;
                    const prevDone = idx === 0 || progress[unit.lessons[idx - 1]!.id]?.completed;
                    const isLocked = locked || (!prevDone && !completed);
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
                              {lesson.titleEn} · {lesson.exercises.length} exercises
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
