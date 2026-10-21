import { Link, useLocation, useParams } from "react-router-dom";
import { useContentStore } from "@/store/useContentStore";
import { useStore } from "@/store/useStore";
import ScriptText from "@/components/ScriptText";
import { Icon, Logo, ProgressBar, StatChip } from "@/components/ui";

interface LocState {
  mistakes: number;
  perfect: boolean;
  firstCompletion: boolean;
  newStreakDay: boolean;
}

export default function LessonComplete() {
  const { id } = useParams();
  const units = useContentStore((s) => s.units);
  const streak = useStore((s) => s.streakCount);
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
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="max-w-content w-full text-center">
          <span className="inline-block">
            <Logo size={72} />
          </span>
          <h1 className="text-display-xl mt-6">Lesson complete</h1>
          <Link to="/" className="btn-primary btn-block mt-10">
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
    <div className="min-h-screen flex flex-col px-6 pt-[calc(40px+env(safe-area-inset-top))] pb-[calc(24px+env(safe-area-inset-bottom))]">
      <div className="mx-auto max-w-content w-full flex-1 flex flex-col">
        <div className="flex-1 flex flex-col justify-center">
          <Logo size={72} />
          <h1 className="text-display-xl mt-6">
            {state.perfect ? <ScriptText>Жарайсың!</ScriptText> : "Lesson complete"}
          </h1>
          <p className="text-lede text-berkut-ink-muted mt-3">
            {state.perfect ? "A perfect run. " : ""}
            <ScriptText>{found.titleKk}</ScriptText> · {found.titleEn}
          </p>

          <div className="card mt-8 flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <Stat label="Accuracy" value={`${Math.max(0, accuracy)}%`} />
              <Stat label="Mistakes" value={state.mistakes} />
            </div>
            <ProgressBar value={Math.max(0, accuracy)} max={100} tone="success" label="Accuracy" />
          </div>

          {(state.newStreakDay || (state.perfect && state.firstCompletion)) && (
            <div className="mt-6 flex flex-col gap-3">
              {state.newStreakDay && (
                <div className="flex items-center gap-3 text-label">
                  <StatChip value={streak} /> Streak extended
                </div>
              )}
              {state.perfect && state.firstCompletion && (
                <div className="flex items-center gap-3 text-label">
                  <span className="grid h-chip w-chip place-items-center rounded-full bg-berkut-sun-soft text-berkut-sun">
                    <Icon name="star" size={18} />
                  </span>
                  Perfect Round badge unlocked
                </div>
              )}
            </div>
          )}
        </div>
        <div className="mt-10 grid gap-3">
          <Link to="/" className="btn-primary btn-block">Continue</Link>
          <Link to="/practice" className="btn-secondary btn-block">Review words</Link>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div>
      <div className="text-small text-berkut-ink-muted">{label}</div>
      <div className="text-title-lg tabular-nums mt-1">{value}</div>
    </div>
  );
}
