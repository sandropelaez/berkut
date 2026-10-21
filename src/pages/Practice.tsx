import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useStore } from "@/store/useStore";
import { useContentStore } from "@/store/useContentStore";
import { dueItems } from "@/core/srs";
import ScriptText from "@/components/ScriptText";
import { speakKazakh } from "@/core/tts";
import { answersMatch } from "@/core/scoring";
import { ChoiceTile, optionState, SpokenPrompt, SunMark } from "@/components/ui";

export default function Practice() {
  const srsMap = useStore((s) => s.srs);
  const reviewVocab = useStore((s) => s.reviewVocab);
  const ensureSrs = useStore((s) => s.ensureSrs);
  const bumpStreak = useStore((s) => s.bumpStreak);
  const contentStatus = useContentStore((s) => s.status);
  const loadCourse = useContentStore((s) => s.loadCourse);
  const units = useContentStore((s) => s.units);

  useEffect(() => {
    if (contentStatus === "idle") loadCourse("kk");
  }, [contentStatus, loadCourse]);

  const allVocabList = useMemo(() => {
    const seen = new Set<string>();
    const out: { id: string; kazakh: string; english: string }[] = [];
    for (const u of units) {
      for (const l of u.lessons) {
        for (const v of l.vocab) {
          if (!seen.has(v.id)) {
            seen.add(v.id);
            out.push(v);
          }
        }
      }
    }
    return out;
  }, [units]);
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
      <div className="mx-auto max-w-md px-4 py-10 text-center">
        <h1 className="text-[26px] leading-8">Daily review</h1>
        <p className="text-berkut-muted dark:text-berkut-muted-dark mt-3">
          Nothing due right now. Complete a lesson to seed your review queue.
        </p>
        <Link to="/" className="btn-primary mt-8 w-full">
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
      <div className="mx-auto max-w-md px-4 py-10 text-center">
        <SunMark size={88} className="mx-auto" />
        <h1 className="text-[26px] leading-8 mt-4">Review complete</h1>
        <p className="text-berkut-muted dark:text-berkut-muted-dark mt-2">
          Words you got wrong are queued for tomorrow.
        </p>
        <Link to="/" className="btn-primary mt-8 w-full">
          Back home
        </Link>
      </div>
    );
  }

  // Seed any missing SRS entries
  ensureSrs(due.map((v) => v.id));

  return (
    <div className="mx-auto max-w-content px-4 py-6">
      <span className="eyebrow tabular-nums">
        Review {idx + 1} of {due.length}
      </span>
      <h1 className="text-[26px] leading-8 mt-2">What does this mean?</h1>

      <div className="mt-6">
        <SpokenPrompt onSpeak={() => speakKazakh(current.kazakh)}>
          <ScriptText>{current.kazakh}</ScriptText>
        </SpokenPrompt>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-8">
        {distractors.map((v) => {
          const selected = picked === v.english;
          const isCorrect = answersMatch(v.english, current.english);
          return (
            <ChoiceTile
              key={v.id}
              onClick={() => check(v.english)}
              state={optionState(picked ? "checked" : "answering", selected, isCorrect)}
            >
              {v.english}
            </ChoiceTile>
          );
        })}
      </div>
    </div>
  );
}
