import { Link, useLocation, useParams } from "react-router-dom";
import { useContentStore } from "@/store/useContentStore";
import ScriptText from "@/components/ScriptText";
import { FlameIcon, Ornament, StarIcon, SunMark } from "@/components/ui";

interface LocState {
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
    mistakes: 0,
    perfect: false,
    firstCompletion: false,
    newStreakDay: false,
  };

  if (!found) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <SunMark size={96} className="mx-auto" />
          <h1 className="text-[32px] leading-10 mt-5">Lesson complete</h1>
          <Link to="/" className="btn-primary mt-8 w-full">
            Back to your path
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
    <div className="min-h-screen flex flex-col px-4 pt-[calc(40px+env(safe-area-inset-top))] pb-[calc(24px+env(safe-area-inset-bottom))]">
      <div className="mx-auto max-w-sm w-full flex-1 flex flex-col text-center">
        <div className="flex-1 flex flex-col justify-center">
        <SunMark size={112} className="mx-auto" />
        <h1 className="text-[32px] leading-10 mt-5">{state.perfect ? "Жарайсың!" : "Lesson complete"}</h1>
        <p className="text-berkut-muted mt-2">
          {state.perfect ? "A perfect run. " : ""}
          <ScriptText>{found.titleKk}</ScriptText> · {found.titleEn}
        </p>

        <Ornament id="complete" className="my-8" />

        <div className="grid grid-cols-2 gap-3">
          <Stat label="Accuracy" value={`${accuracy}%`} highlight />
          <Stat label="Mistakes" value={state.mistakes} />
        </div>

        {state.newStreakDay && (
          <div className="mt-6 flex items-center gap-3 rounded-sheet bg-berkut-gold-soft p-4 text-left font-semibold">
            <FlameIcon className="h-6 w-6 text-berkut-gold-ink" /> Streak extended
          </div>
        )}
        {state.perfect && state.firstCompletion && (
          <div className="mt-3 flex items-center gap-3 rounded-sheet bg-berkut-gold-soft p-4 text-left font-semibold">
            <StarIcon className="h-6 w-6 text-berkut-gold-ink" /> Perfect Round badge unlocked
          </div>
        )}

        </div>
        <div className="mt-8 grid gap-3">
          <Link to="/" className="btn-primary w-full">Continue</Link>
          <Link to="/practice" className="btn-secondary w-full">Review words</Link>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, highlight }: { label: string; value: string | number; highlight?: boolean }) {
  return (
    <div className={`rounded-tile p-3 ${highlight ? "bg-berkut-gold text-berkut-on-gold" : "bg-berkut-raised shadow-card"}`}>
      <div className={`text-[11px] font-bold uppercase tracking-[0.1em] ${highlight ? "" : "text-berkut-muted"}`}>{label}</div>
      <div className="font-display text-xl font-semibold tabular-nums mt-1">{value}</div>
    </div>
  );
}
