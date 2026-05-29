import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useContentStore } from "@/store/useContentStore";
import { useStore } from "@/store/useStore";
import ProgressBar from "@/components/ProgressBar";
import MultipleChoice from "@/exercises/MultipleChoice";
import TranslateENKK from "@/exercises/TranslateENKK";
import TranslateKKEN from "@/exercises/TranslateKKEN";
import Listening from "@/exercises/Listening";
import MatchPairs from "@/exercises/MatchPairs";
import FillBlank from "@/exercises/FillBlank";
import { XP } from "@/core/scoring";
import type { Exercise, Lesson } from "@/core/types";
import ReportButton from "@/components/ReportButton";

type Phase = "answering" | "checked";

export default function LessonPlayer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const loadLesson = useContentStore((s) => s.loadLesson);

  const hearts = useStore((s) => s.hearts);
  const spendHeart = useStore((s) => s.spendHeart);
  const ensureSrs = useStore((s) => s.ensureSrs);
  const reviewVocab = useStore((s) => s.reviewVocab);
  const recordLesson = useStore((s) => s.recordLesson);
  const bumpStreak = useStore((s) => s.bumpStreak);

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [idx, setIdx] = useState(0);
  const [phase, setPhase] = useState<Phase>("answering");
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [scoreAcc, setScoreAcc] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [retries, setRetries] = useState(0);
  const [floats, setFloats] = useState<Array<{ id: number; xp: number }>>([]);

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
      ensureSrs(l.vocab.map((v) => v.id));
    });
    return () => {
      cancelled = true;
    };
  }, [id, loadLesson, ensureSrs]);

  if (loadError) {
    return (
      <div className="px-4 py-10 text-center">
        <h1 className="text-xl font-bold">Lesson not found.</h1>
        <Link to="/" className="btn-primary mt-4 inline-flex">
          Back home
        </Link>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-3xl animate-pulse">🦅</div>
      </div>
    );
  }

  const exercise: Exercise | undefined = lesson.exercises[idx];
  if (!exercise) return null;

  const total = lesson.exercises.length;

  function handleAnswer(correct: boolean, vocabIds: string[] = []) {
    if (phase !== "answering") return;
    setPhase("checked");
    setFeedback(correct ? "correct" : "wrong");

    for (const vid of vocabIds) reviewVocab(vid, correct);

    if (correct) {
      const xp = retries === 0 ? XP.CORRECT_FIRST : XP.CORRECT_SECOND;
      setScoreAcc((s) => s + xp);
      const fid = Date.now();
      setFloats((f) => [...f, { id: fid, xp }]);
      setTimeout(() => setFloats((f) => f.filter((x) => x.id !== fid)), 900);
    } else {
      setMistakes((m) => m + 1);
      spendHeart();
    }
  }

  function nextExercise() {
    if (hearts <= 0 && feedback === "wrong") {
      navigate(`/`, { replace: true });
      return;
    }
    if (idx + 1 >= total) {
      const perfect = mistakes === 0;
      const result = recordLesson(lesson!.id, scoreAcc, perfect);
      const newDay = bumpStreak();
      navigate(`/lesson/${lesson!.id}/complete`, {
        replace: true,
        state: {
          xpAwarded: result.xpAwarded + (newDay ? XP.STREAK_DAY : 0),
          score: scoreAcc,
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
      case "LISTENING":
        return <Listening key={exercise.id} prompt={exercise.prompt as any} phase={phase} onAnswer={handleAnswer} />;
      case "MATCH_PAIRS":
        return <MatchPairs key={exercise.id} prompt={exercise.prompt as any} phase={phase} onAnswer={handleAnswer} />;
      case "FILL_BLANK":
        return <FillBlank key={exercise.id} prompt={exercise.prompt as any} phase={phase} onAnswer={handleAnswer} />;
    }
  })();

  if (hearts <= 0) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md text-center">
          <div className="text-5xl">💔</div>
          <h1 className="text-2xl font-extrabold mt-3">Out of hearts</h1>
          <p className="text-berkut-muted dark:text-berkut-muted-dark mt-2">
            Hearts regenerate over time (1 every 30 minutes).
          </p>
          <Link to="/" className="btn-primary mt-6 inline-flex">
            Back home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-berkut-bg dark:bg-berkut-bg-dark">
      <header className="px-4 py-3 border-b border-berkut-border dark:border-berkut-border-dark flex items-center gap-3">
        <button onClick={() => navigate("/")} className="text-berkut-muted dark:text-berkut-muted-dark text-2xl" aria-label="Quit lesson">
          ✕
        </button>
        <div className="flex-1">
          <ProgressBar value={idx + (phase === "checked" ? 1 : 0)} max={total} />
        </div>
        <div className="text-rose-500 font-extrabold flex items-center gap-1">❤️ {hearts}</div>
      </header>

      <div className="flex-1 mx-auto w-full max-w-2xl px-4 py-6 relative">
        {ExerciseEl}
        <div className="pointer-events-none absolute right-6 top-6">
          {floats.map((f) => (
            <div key={f.id} className="text-berkut-success font-extrabold text-2xl animate-floatUp">
              +{f.xp} XP
            </div>
          ))}
        </div>
      </div>

      <footer
        className={`border-t-4 px-4 py-4 ${
          feedback === "correct"
            ? "bg-berkut-success/10 border-berkut-success"
            : feedback === "wrong"
              ? "bg-berkut-error/10 border-berkut-error"
              : "border-berkut-border dark:border-berkut-border-dark bg-white dark:bg-berkut-card-dark"
        }`}
      >
        <div className="mx-auto max-w-2xl flex items-center gap-3">
          {feedback === "correct" && <div className="font-bold text-berkut-success">Дұрыс! Nice.</div>}
          {feedback === "wrong" && <div className="font-bold text-berkut-error">Not quite. Try again.</div>}
          <div className="ml-auto flex items-center gap-3">
            <ReportButton exerciseId={exercise.id} />
            {feedback === "wrong" && retries === 0 && (
              <button onClick={tryAgain} className="btn-outline">
                Try again
              </button>
            )}
            {phase === "checked" && (
              <button onClick={nextExercise} className="btn-primary">
                Continue
              </button>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}
