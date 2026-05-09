import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useStore } from "@/store/useStore";
import { dueItems } from "@/core/srs";
import { allVocab } from "@/data/units";
import ScriptText from "@/components/ScriptText";
import { speakKazakh } from "@/core/tts";
import { answersMatch } from "@/core/scoring";

export default function Practice() {
  const srsMap = useStore((s) => s.srs);
  const reviewVocab = useStore((s) => s.reviewVocab);
  const ensureSrs = useStore((s) => s.ensureSrs);
  const bumpStreak = useStore((s) => s.bumpStreak);

  const allVocabList = useMemo(() => allVocab(), []);
  const due = useMemo(() => {
    const items = dueItems(Object.values(srsMap));
    return items
      .map((it) => allVocabList.find((v) => v.id === it.vocabId))
      .filter(Boolean)
      .slice(0, 15) as typeof allVocabList;
  }, [srsMap, allVocabList]);

  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  if (!due.length) {
    return (
      <div className="mx-auto max-w-md px-4 sm:pl-32 py-10 text-center">
        <h1 className="text-2xl font-extrabold">Daily Review</h1>
        <p className="text-berkut-muted dark:text-berkut-muted-dark mt-3">
          Nothing due right now. Complete a lesson to seed your review queue.
        </p>
        <Link to="/" className="btn-primary mt-6 inline-flex">
          Back to lessons
        </Link>
      </div>
    );
  }

  const current = due[idx]!;
  const distractors = useMemo(() => {
    const pool = allVocabList.filter((v) => v.id !== current.id);
    const shuffled = [...pool].sort(() => Math.random() - 0.5).slice(0, 3);
    return [current, ...shuffled].sort(() => Math.random() - 0.5);
  }, [current.id, allVocabList]);

  function check(option: string) {
    if (picked) return;
    setPicked(option);
    const correct = answersMatch(option, current.english);
    setTimeout(() => {
      reviewVocab(current.id, correct);
      if (idx + 1 >= due.length) {
        bumpStreak();
        setDone(true);
      } else {
        setIdx(idx + 1);
        setPicked(null);
      }
    }, 900);
  }

  if (done) {
    return (
      <div className="mx-auto max-w-md px-4 sm:pl-32 py-10 text-center">
        <div className="text-6xl">🌟</div>
        <h1 className="text-2xl font-extrabold mt-3">Review complete!</h1>
        <p className="text-berkut-muted dark:text-berkut-muted-dark mt-2">
          Words you got wrong are queued for tomorrow.
        </p>
        <Link to="/" className="btn-primary mt-6 inline-flex">
          Back home
        </Link>
      </div>
    );
  }

  // Seed any missing SRS entries
  ensureSrs(due.map((v) => v.id));

  return (
    <div className="mx-auto max-w-2xl px-4 sm:pl-32 py-6">
      <div className="text-sm font-semibold text-berkut-muted dark:text-berkut-muted-dark">
        Review {idx + 1} / {due.length}
      </div>
      <h1 className="text-3xl font-extrabold mt-2">What does this mean?</h1>

      <div className="mt-8 card text-center">
        <button
          onClick={() => speakKazakh(current.kazakh)}
          className="text-5xl font-extrabold kk hover:opacity-75"
          title="Hear pronunciation"
        >
          <ScriptText>{current.kazakh}</ScriptText>
          <span className="text-base ml-2">🔊</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-8">
        {distractors.map((v) => {
          const selected = picked === v.english;
          const isCorrect = answersMatch(v.english, current.english);
          const cls = !picked
            ? "btn-outline"
            : selected
              ? isCorrect
                ? "btn-success"
                : "btn-error"
              : isCorrect
                ? "btn-success"
                : "btn-outline opacity-50";
          return (
            <button key={v.id} onClick={() => check(v.english)} className={cls}>
              {v.english}
            </button>
          );
        })}
      </div>
    </div>
  );
}
