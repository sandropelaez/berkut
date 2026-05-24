import { Link, useLocation, useParams } from "react-router-dom";
import { useContentStore } from "@/store/useContentStore";
import ScriptText from "@/components/ScriptText";

interface LocState {
  xpAwarded: number;
  score: number;
  mistakes: number;
  perfect: boolean;
  firstCompletion: boolean;
  newStreakDay: boolean;
}

export default function LessonComplete() {
  const { id } = useParams();
  const units = useContentStore((s) => s.units);
  const found = id
    ? units.flatMap((u) => u.lessons).find((l) => l.id === id)
    : undefined;
  const state = (useLocation().state as LocState | null) ?? {
    xpAwarded: 0,
    score: 0,
    mistakes: 0,
    perfect: false,
    firstCompletion: false,
    newStreakDay: false,
  };

  if (!found) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="text-7xl">🎉</div>
          <h1 className="text-3xl font-extrabold mt-3">Lesson complete!</h1>
          <Link to="/" className="btn-primary mt-8">
            Back to skill tree
          </Link>
        </div>
      </div>
    );
  }

  const total = found.exercises.length || 12;
  const accuracy = total
    ? Math.round(((total - state.mistakes) / total) * 100)
    : 100;

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="text-7xl">{state.perfect ? "🌟" : "🎉"}</div>
        <h1 className="text-3xl font-extrabold mt-3">Lesson complete!</h1>
        <p className="text-berkut-muted dark:text-berkut-muted-dark mt-1">
          <ScriptText>{found.titleKk}</ScriptText> — {found.titleEn}
        </p>

        <div className="grid grid-cols-3 gap-3 mt-8">
          <Stat label="Total XP" value={`+${state.xpAwarded}`} highlight />
          <Stat label="Accuracy" value={`${accuracy}%`} />
          <Stat label="Hearts left" value={state.perfect ? "❤️❤️❤️" : `−${state.mistakes}`} />
        </div>

        {state.newStreakDay && (
          <div className="mt-6 card bg-orange-50 border-orange-200 dark:bg-orange-900/20 dark:border-orange-700">
            🔥 Streak extended!
          </div>
        )}
        {state.perfect && state.firstCompletion && (
          <div className="mt-3 card bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-700">
            ⭐ Perfect Round badge unlocked
          </div>
        )}

        <div className="mt-8 grid gap-3">
          <Link to="/" className="btn-primary">Back to skill tree</Link>
          <Link to="/practice" className="btn-outline">Practice review</Link>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, highlight }: { label: string; value: string | number; highlight?: boolean }) {
  return (
    <div className={`rounded-2xl p-4 border-2 ${highlight ? "border-berkut-success bg-berkut-success/10" : "border-berkut-border dark:border-berkut-border-dark"}`}>
      <div className="text-xs uppercase font-bold text-berkut-muted dark:text-berkut-muted-dark">{label}</div>
      <div className="text-xl font-extrabold mt-1">{value}</div>
    </div>
  );
}
