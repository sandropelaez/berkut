import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useStore } from "@/store/useStore";
import { useContentStore, type RepeatExercise } from "@/store/useContentStore";
import { activeMistakes, CLEAR_AFTER, isActive, pickSession } from "@/core/mistakes";
import ExerciseSession from "@/components/ExerciseSession";
import { Ornament, ResultStat, SunLoader, SunMark } from "@/components/ui";

// Repeat menu (docs/repetition.md). /repeat shows the empty state, or goes
// straight into a session at /repeat/session when there is something to repeat.

export function RepeatHome() {
  const count = useStore((s) => activeMistakes(s.mistakes).length);
  if (count) return <Navigate to="/repeat/session" replace />;

  return (
    <div className="mx-auto max-w-md px-4 py-10 text-center">
      <h1 className="text-[26px] leading-8">Repeat</h1>
      <p className="text-berkut-muted mt-3">
        Nothing to repeat. Exercises you get wrong in lessons will show up here.
      </p>
      <Link to="/" className="btn-primary mt-8 w-full">
        Back to lessons
      </Link>
    </div>
  );
}

interface Stats {
  correct: number;
  cleared: number;
}

export function RepeatSession() {
  const navigate = useNavigate();
  const loadExercises = useContentStore((s) => s.loadExercises);
  const mistakes = useStore((s) => s.mistakes);
  const recordExerciseResult = useStore((s) => s.recordExerciseResult);
  const dropMistakes = useStore((s) => s.dropMistakes);
  const bumpStreak = useStore((s) => s.bumpStreak);

  const [round, setRound] = useState(0);
  const [exercises, setExercises] = useState<RepeatExercise[] | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [stats, setStats] = useState<Stats>({ correct: 0, cleared: 0 });
  const [done, setDone] = useState(false);

  // Pick once per round: answers change the list, but not this session.
  useEffect(() => {
    const ids = pickSession(useStore.getState().mistakes);
    if (!ids.length) {
      navigate("/repeat", { replace: true });
      return;
    }
    let cancelled = false;
    setExercises(null);
    setLoadError(false);
    loadExercises(ids).then((found) => {
      if (cancelled) return;
      if (!found) {
        setLoadError(true);
        return;
      }
      const byId = new Map(found.map((e) => [e.id, e]));
      // Removed or archived from the course: nothing left to repeat.
      dropMistakes(ids.filter((id) => !byId.has(id)));
      if (!byId.size) {
        setRound((r) => r + 1);
        return;
      }
      setExercises(ids.flatMap((id) => byId.get(id) ?? []));
    });
    return () => {
      cancelled = true;
    };
  }, [round, navigate, loadExercises, dropMistakes]);

  function onResult(e: RepeatExercise, correct: boolean) {
    recordExerciseResult(e.id, e.lessonId, correct);
    if (!correct) return;
    const m = useStore.getState().mistakes[e.id];
    const cleared = !!m && !isActive(m);
    setStats((s) => ({ correct: s.correct + 1, cleared: s.cleared + (cleared ? 1 : 0) }));
  }

  function finish() {
    bumpStreak();
    setDone(true);
  }

  function again() {
    setStats({ correct: 0, cleared: 0 });
    setDone(false);
    setRound((r) => r + 1);
  }

  if (loadError) {
    return (
      <div className="mx-auto max-w-md px-4 py-10 text-center">
        <h1 className="text-xl">Couldn't load your exercises.</h1>
        <button onClick={() => setRound((r) => r + 1)} className="btn-primary mt-6 w-full">
          Try again
        </button>
        <Link to="/" className="btn-secondary mt-3 w-full">
          Back home
        </Link>
      </div>
    );
  }

  if (!exercises) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <SunLoader label="Loading exercises…" />
      </div>
    );
  }

  if (done) {
    const remaining = activeMistakes(mistakes).length;
    return (
      <div className="min-h-screen flex flex-col px-4 pt-[calc(40px+env(safe-area-inset-top))] pb-[calc(24px+env(safe-area-inset-bottom))]">
        <div className="mx-auto max-w-sm w-full flex-1 flex flex-col text-center">
          <div className="flex-1 flex flex-col justify-center">
            <SunMark size={112} className="mx-auto" />
            <h1 className="text-[32px] leading-10 mt-5">Repeat complete</h1>
            <p className="text-berkut-muted mt-2">
              {remaining
                ? `${remaining} ${remaining === 1 ? "exercise" : "exercises"} left to repeat.`
                : "Your repeat list is empty."}
            </p>

            <Ornament id="repeat" className="my-8" />

            <div className="grid grid-cols-2 gap-3">
              <ResultStat label="Correct" value={`${stats.correct}/${exercises.length}`} highlight />
              <ResultStat label="Cleared" value={stats.cleared} />
            </div>
          </div>
          <div className="mt-8 grid gap-3">
            {remaining > 0 && (
              <button onClick={again} className="btn-primary w-full">
                Repeat more
              </button>
            )}
            <Link to="/" className={`${remaining > 0 ? "btn-secondary" : "btn-primary"} w-full`}>
              Back home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ExerciseSession
      key={round}
      exercises={exercises}
      onResult={onResult}
      onFinish={finish}
      onQuit={() => navigate("/")}
      caption={(e) => {
        const m = mistakes[e.id];
        if (!m) return null;
        return (
          <span className="eyebrow tabular-nums">
            {isActive(m) ? `Correct ${m.correctStreak} of ${CLEAR_AFTER}` : "Cleared from your list"}
          </span>
        );
      }}
    />
  );
}
