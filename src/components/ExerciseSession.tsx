import { useState, type ReactNode } from "react";
import ProgressBar from "@/components/ProgressBar";
import MultipleChoice from "@/exercises/MultipleChoice";
import TranslateENKK from "@/exercises/TranslateENKK";
import TranslateKKEN from "@/exercises/TranslateKKEN";
import MatchPairs from "@/exercises/MatchPairs";
import FillBlank from "@/exercises/FillBlank";
import TeachCard from "@/exercises/TeachCard";
import type { Exercise } from "@/core/types";
import ReportButton from "@/components/ReportButton";
import { CheckIcon, CloseIcon, CrossIcon } from "@/components/ui";

type Phase = "answering" | "checked";

// Plays a list of exercises with the check/feedback footer. Shared by lessons
// and the Repeat menu.
export default function ExerciseSession<E extends Exercise>({
  exercises,
  onResult,
  onFinish,
  onQuit,
  caption,
}: {
  exercises: E[];
  // A graded exercise's first attempt; "Try again" attempts aren't reported.
  onResult?: (exercise: E, correct: boolean) => void;
  // `mistakes` counts every wrong attempt, retries included.
  onFinish: (mistakes: number) => void;
  onQuit: () => void;
  caption?: (exercise: E) => ReactNode;
}) {
  const [idx, setIdx] = useState(0);
  const [phase, setPhase] = useState<Phase>("answering");
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [mistakes, setMistakes] = useState(0);
  const [retries, setRetries] = useState(0);

  const exercise: E | undefined = exercises[idx];
  if (!exercise) return null;

  const total = exercises.length;
  // Teach cards are ungraded: no answer phase, just read and continue.
  const isTeach = exercise.type === "TEACH";

  function handleAnswer(correct: boolean) {
    if (phase !== "answering") return;
    setPhase("checked");
    setFeedback(correct ? "correct" : "wrong");
    if (retries === 0) onResult?.(exercise!, correct);
    if (!correct) setMistakes((m) => m + 1);
  }

  function nextExercise() {
    if (idx + 1 >= total) {
      onFinish(mistakes);
    } else {
      setIdx((i) => i + 1);
      setPhase("answering");
      setFeedback(null);
      setRetries(0);
    }
  }

  function tryAgain() {
    setPhase("answering");
    setFeedback(null);
    setRetries((r) => r + 1);
  }

  const ExerciseEl = (() => {
    switch (exercise.type) {
      case "MULTIPLE_CHOICE":
        return <MultipleChoice key={exercise.id} prompt={exercise.prompt as any} phase={phase} onAnswer={handleAnswer} />;
      case "TRANSLATE_EN_KK":
        return <TranslateENKK key={exercise.id} prompt={exercise.prompt as any} phase={phase} onAnswer={handleAnswer} />;
      case "TRANSLATE_KK_EN":
        return <TranslateKKEN key={exercise.id} prompt={exercise.prompt as any} phase={phase} onAnswer={handleAnswer} />;
      case "MATCH_PAIRS":
        return <MatchPairs key={exercise.id} prompt={exercise.prompt as any} phase={phase} onAnswer={handleAnswer} />;
      case "FILL_BLANK":
        return <FillBlank key={exercise.id} prompt={exercise.prompt as any} phase={phase} onAnswer={handleAnswer} />;
      case "TEACH":
        return <TeachCard key={exercise.id} prompt={exercise.prompt as any} />;
    }
  })();

  return (
    <div className="min-h-screen flex flex-col bg-berkut-surface">
      <header className="sticky top-0 z-10 bg-berkut-surface pt-[env(safe-area-inset-top)]">
        <div className="mx-auto max-w-content px-2 h-14 flex items-center gap-2">
          <button
            onClick={onQuit}
            className="grid h-12 w-12 flex-none place-items-center rounded-full text-berkut-muted hover:bg-berkut-sunk"
            aria-label="Quit"
          >
            <CloseIcon className="h-6 w-6" />
          </button>
          <div className="flex-1">
            <ProgressBar value={idx + (phase === "checked" || isTeach ? 1 : 0)} max={total} />
          </div>
          <span className="w-2" aria-hidden="true" />
        </div>
      </header>

      <div className="flex-1 mx-auto w-full max-w-content px-4 pt-4 pb-8">
        {caption && <div className="mb-3">{caption(exercise)}</div>}
        {ExerciseEl}
      </div>

      <footer
        className={`sticky bottom-0 rounded-t-sheet sm:rounded-none shadow-sheet px-4 pt-4 pb-[calc(16px+env(safe-area-inset-bottom))] transition-colors ${
          feedback === "correct"
            ? "bg-berkut-success-soft text-berkut-success"
            : feedback === "wrong"
              ? "bg-berkut-danger-soft text-berkut-danger"
              : "bg-berkut-raised"
        }`}
      >
        <div className="mx-auto max-w-content flex flex-col gap-3">
          {feedback && (
            <div className="flex items-center gap-3" role="status">
              <span
                className={`grid h-9 w-9 flex-none place-items-center rounded-full ${
                  feedback === "correct" ? "bg-berkut-success text-berkut-on-success" : "bg-berkut-danger text-berkut-on-danger"
                }`}
              >
                {feedback === "correct" ? <CheckIcon /> : <CrossIcon />}
              </span>
              <div className="flex-1 font-display text-lg font-semibold">
                {feedback === "correct" ? "Дұрыс!" : "Not quite"}
              </div>
              <ReportButton exerciseId={exercise.id} />
            </div>
          )}
          <div className="flex items-center gap-3 [&>*]:flex-1">
            {!feedback && (
              <div className="!flex-none">
                <ReportButton exerciseId={exercise.id} />
              </div>
            )}
            {isTeach && (
              <button onClick={nextExercise} className="btn-primary">
                Got it
              </button>
            )}
            {feedback === "wrong" && retries === 0 && (
              <button onClick={tryAgain} className="btn-secondary">
                Try again
              </button>
            )}
            {phase === "checked" && (
              <button
                onClick={nextExercise}
                className={feedback === "correct" ? "btn-success" : feedback === "wrong" ? "btn-danger" : "btn-primary"}
              >
                Continue
              </button>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}
