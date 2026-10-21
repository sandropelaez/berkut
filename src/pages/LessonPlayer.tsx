import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useContentStore } from "@/store/useContentStore";
import { useStore } from "@/store/useStore";
import ProgressBar from "@/components/ProgressBar";
import MultipleChoice from "@/exercises/MultipleChoice";
import TranslateENKK from "@/exercises/TranslateENKK";
import TranslateKKEN from "@/exercises/TranslateKKEN";
import MatchPairs from "@/exercises/MatchPairs";
import FillBlank from "@/exercises/FillBlank";
import TeachCard from "@/exercises/TeachCard";
import { buildSession, requeueMistake, type SessionItem } from "@/core/session";
import type { Exercise, Lesson } from "@/core/types";
import ReportButton from "@/components/ReportButton";
import { CheckIcon, CloseIcon, CrossIcon, ReviewIcon, SunLoader } from "@/components/ui";

type Phase = "answering" | "checked";

export default function LessonPlayer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const loadLesson = useContentStore((s) => s.loadLesson);

  const ensureSrs = useStore((s) => s.ensureSrs);
  const reviewVocab = useStore((s) => s.reviewVocab);
  const recordLesson = useStore((s) => s.recordLesson);
  const bumpStreak = useStore((s) => s.bumpStreak);

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loadError, setLoadError] = useState(false);
  // The lesson's exercises plus echoes, a closing review and re-asked mistakes.
  const [queue, setQueue] = useState<SessionItem[]>([]);
  const [idx, setIdx] = useState(0);
  const [phase, setPhase] = useState<Phase>("answering");
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [mistakes, setMistakes] = useState(0);
  const [retries, setRetries] = useState(0);
  const [missed, setMissed] = useState(false);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    loadLesson(id).then((l) => {
      if (cancelled) return;
      if (!l) {
        setLoadError(true);
        return;
      }
      setLesson(l);
      setQueue(buildSession(l));
      ensureSrs(l.vocab.map((v) => v.id));
    });
    return () => {
      cancelled = true;
    };
  }, [id, loadLesson, ensureSrs]);

  if (loadError) {
    return (
      <div className="px-4 py-10 text-center">
        <h1 className="text-xl">Lesson not found.</h1>
        <Link to="/" className="btn-primary mt-4 inline-flex">
          Back home
        </Link>
      </div>
    );
  }

  if (!lesson || !queue.length) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <SunLoader label="Loading lesson…" />
      </div>
    );
  }

  const item: SessionItem | undefined = queue[idx];
  if (!item) return null;
  const exercise: Exercise = item.exercise;

  const total = queue.length;
  // Teach cards are ungraded: no answer phase, just read and continue.
  const isTeach = exercise.type === "TEACH";

  function handleAnswer(correct: boolean, vocabIds: string[] = []) {
    if (phase !== "answering") return;
    setPhase("checked");
    setFeedback(correct ? "correct" : "wrong");

    for (const vid of vocabIds) reviewVocab(vid, correct);

    if (!correct) {
      setMistakes((m) => m + 1);
      setMissed(true);
    }
  }

  function nextExercise() {
    // Anything missed — even if fixed on the retry — comes back later.
    const next = missed ? requeueMistake(queue, idx) : queue;
    if (next !== queue) setQueue(next);
    if (idx + 1 >= next.length) {
      const perfect = mistakes === 0;
      const result = recordLesson(lesson!.id, perfect);
      const newDay = bumpStreak();
      navigate(`/lesson/${lesson!.id}/complete`, {
        replace: true,
        state: {
          mistakes,
          perfect,
          firstCompletion: result.firstCompletion,
          newStreakDay: newDay,
        },
      });
    } else {
      setIdx((i) => i + 1);
      setPhase("answering");
      setFeedback(null);
      setRetries(0);
      setMissed(false);
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
            onClick={() => navigate("/")}
            className="grid h-12 w-12 flex-none place-items-center rounded-full text-berkut-muted hover:bg-berkut-sunk"
            aria-label="Quit lesson"
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
        {item.kind === "mistake" && (
          <span className="chip mb-4 bg-berkut-danger-soft text-berkut-danger font-sans text-[11px] font-bold uppercase tracking-[0.12em]">
            <ReviewIcon className="h-4 w-4" /> Previous mistake
          </span>
        )}
        {item.kind === "review" && (
          <span className="chip mb-4 bg-berkut-sky-soft text-berkut-sky-ink font-sans text-[11px] font-bold uppercase tracking-[0.12em]">
            <ReviewIcon className="h-4 w-4" /> Mixed review
          </span>
        )}
        {/* Keyed by slot: an exercise can come back, and must start fresh. */}
        <div key={item.key}>{ExerciseEl}</div>
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
