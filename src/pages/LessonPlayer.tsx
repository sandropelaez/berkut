import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useContentStore } from "@/store/useContentStore";
import { useStore } from "@/store/useStore";
import MultipleChoice from "@/exercises/MultipleChoice";
import TranslateENKK from "@/exercises/TranslateENKK";
import TranslateKKEN from "@/exercises/TranslateKKEN";
import MatchPairs from "@/exercises/MatchPairs";
import FillBlank from "@/exercises/FillBlank";
import TypeAnswer from "@/exercises/TypeAnswer";
import SpotMistake from "@/exercises/SpotMistake";
import ChooseReply from "@/exercises/ChooseReply";
import TeachCard from "@/exercises/TeachCard";
import { buildSession, requeueMistake, type SessionItem } from "@/core/session";
import type { Exercise, Lesson } from "@/core/types";
import ReportButton from "@/components/ReportButton";
import { LessonActionSlot } from "@/components/LessonAction";
import ScriptText from "@/components/ScriptText";
import { Button, Icon, LessonHeader, Loader } from "@/components/ui";

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
  // The scrolling area between the header and the bottom bar.
  const scrollRef = useRef<HTMLDivElement>(null);
  // Where exercises put their own button (Check), next to Report.
  const [actionSlot, setActionSlot] = useState<HTMLDivElement | null>(null);

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

  const itemKey = queue[idx]?.key;

  // Each exercise starts at the top.
  useLayoutEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
  }, [itemKey]);

  // Once answered, bring what the answer revealed (the right option, the
  // correction) into view: the bottom bar grows with the feedback and must
  // never sit on top of it.
  useEffect(() => {
    if (phase !== "checked") return;
    const frame = requestAnimationFrame(() => {
      const area = scrollRef.current;
      if (!area) return;
      const revealed = area.querySelectorAll<HTMLElement>("[role=status], .tile-correct");
      revealed[revealed.length - 1]?.scrollIntoView({ block: "nearest", behavior: "smooth" });
    });
    return () => cancelAnimationFrame(frame);
  }, [phase, itemKey]);

  if (loadError) {
    return (
      <div className="px-6 py-10 text-center">
        <h1 className="text-title-md">Lesson not found.</h1>
        <Link to="/" className="btn-primary mt-6">
          Back home
        </Link>
      </div>
    );
  }

  if (!lesson || !queue.length) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader label="Loading lesson…" />
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
      case "TYPE_ANSWER":
        return <TypeAnswer key={exercise.id} prompt={exercise.prompt as any} phase={phase} onAnswer={handleAnswer} />;
      case "SPOT_MISTAKE":
        return <SpotMistake key={exercise.id} prompt={exercise.prompt as any} phase={phase} onAnswer={handleAnswer} />;
      case "CHOOSE_REPLY":
        return <ChooseReply key={exercise.id} prompt={exercise.prompt as any} phase={phase} onAnswer={handleAnswer} />;
      case "TEACH":
        return <TeachCard key={exercise.id} prompt={exercise.prompt as any} />;
    }
  })();

  return (
    // Exactly the visible screen (dvh tracks the phone's toolbars): the header
    // and bottom bar stay put and only the exercise scrolls, so the bar never
    // covers it.
    <div className="h-viewport flex flex-col bg-berkut-bg">
      <header className="flex-none bg-berkut-bg pt-[env(safe-area-inset-top)]">
        <div className="mx-auto max-w-content px-4 py-2">
          <LessonHeader
            step={idx + (phase === "checked" || isTeach ? 1 : 0)}
            total={total}
            onClose={() => navigate("/")}
          />
        </div>
      </header>

      <main ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
        <div className="mx-auto w-full max-w-content px-4 pb-6 pt-4 min-[360px]:px-5 sm:px-6 sm:pt-6 short:pb-4 short:pt-2">
          {item.kind === "mistake" && (
            <span className="tag mb-4 bg-berkut-danger-soft text-berkut-danger">
              <Icon name="review" size={16} /> Previous mistake
            </span>
          )}
          {item.kind === "review" && (
            <span className="tag mb-4">
              <Icon name="review" size={16} /> Mixed review
            </span>
          )}
          {/* Keyed by slot: an exercise can come back, and must start fresh. */}
          <LessonActionSlot.Provider value={actionSlot}>
            <div key={item.key}>{ExerciseEl}</div>
          </LessonActionSlot.Provider>
        </div>
      </main>

      <footer
        className={`flex-none rounded-t-sheet sm:rounded-none shadow-sheet px-5 sm:px-6 pt-4 short:pt-3 pb-[calc(12px+env(safe-area-inset-bottom))] transition-colors ${
          feedback === "correct"
            ? "bg-berkut-success-soft text-berkut-success"
            : feedback === "wrong"
              ? "bg-berkut-danger-soft text-berkut-danger"
              : "bg-berkut-surface-raised"
        }`}
      >
        <div className="mx-auto max-w-content flex flex-col gap-3 short:gap-2">
          {feedback && (
            <div className="flex items-center gap-3" role="status">
              <span
                className={`grid h-9 w-9 flex-none place-items-center rounded-full ${
                  feedback === "correct" ? "bg-berkut-success text-berkut-on-success" : "bg-berkut-danger text-berkut-on-danger"
                }`}
              >
                <Icon name={feedback === "correct" ? "check" : "cross"} size={20} />
              </span>
              <div className="flex-1 text-title-sm">
                {feedback === "correct" ? <ScriptText>Дұрыс!</ScriptText> : "Not quite"}
              </div>
              <ReportButton exerciseId={exercise.id} />
            </div>
          )}
          <div className="flex min-h-11 items-center gap-3 [&>*]:flex-1">
            {!feedback && (
              <div className="!flex-none">
                <ReportButton exerciseId={exercise.id} />
              </div>
            )}
            {/* An exercise's own Check button lands here (see LessonAction). */}
            <div ref={setActionSlot} className="empty:hidden" />
            {isTeach && (
              <Button size="lg" className="whitespace-nowrap px-5" onClick={nextExercise}>
                Got it
              </Button>
            )}
            {feedback === "wrong" && retries === 0 && (
              <Button variant="secondary" size="lg" className="whitespace-nowrap px-5" onClick={tryAgain}>
                Try again
              </Button>
            )}
            {phase === "checked" && (
              <Button size="lg" className="whitespace-nowrap px-5" onClick={nextExercise}>
                Continue
              </Button>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}
