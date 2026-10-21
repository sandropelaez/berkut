import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useStore } from "@/store/useStore";
import { useContentStore } from "@/store/useContentStore";
import { dueItems } from "@/core/srs";
import { useKazakh } from "@/components/ScriptText";
import { speakKazakh } from "@/core/tts";
import { answersMatch } from "@/core/scoring";
import { ChoiceTile, Logo, optionState, ProgressBar, SpokenPrompt } from "@/components/ui";

export default function Practice() {
  const srsMap = useStore((s) => s.srs);
  const reviewVocab = useStore((s) => s.reviewVocab);
  const ensureSrs = useStore((s) => s.ensureSrs);
  const bumpStreak = useStore((s) => s.bumpStreak);
  const contentStatus = useContentStore((s) => s.status);
  const loadCourse = useContentStore((s) => s.loadCourse);
  const units = useContentStore((s) => s.units);
  const kazakh = useKazakh();

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
      <div className="mx-auto max-w-content px-6 py-10">
        <h1 className="text-title-lg">Daily review</h1>
        <p className="text-body text-berkut-ink-muted mt-3">
          Nothing due right now. Complete a lesson to seed your review queue.
        </p>
        <Link to="/" className="btn-primary btn-block mt-8">
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
      <div className="mx-auto max-w-content px-6 py-10">
        <Logo size={72} />
        <h1 className="text-title-lg mt-6">Review complete</h1>
        <p className="text-body text-berkut-ink-muted mt-2">
          Words you got wrong are queued for tomorrow.
        </p>
        <Link to="/" className="btn-primary btn-block mt-8">
          Back home
        </Link>
      </div>
    );
  }

  // Seed any missing SRS entries
  ensureSrs(due.map((v) => v.id));

  return (
    <div className="mx-auto max-w-content px-6 py-6">
      <div className="flex items-center gap-3.5">
        <div className="flex-1">
          <ProgressBar value={idx} max={due.length} size="sm" label="Review progress" />
        </div>
        <span className="text-small font-semibold tabular-nums text-berkut-ink-muted">
          {idx + 1}/{due.length}
        </span>
      </div>
      <h1 className="text-title-lg mt-6">What does this mean?</h1>

      <div className="mt-6">
        <SpokenPrompt
          {...kazakh(current.kazakh)}
          size={/\s/.test(current.kazakh.trim()) ? "sentence" : "word"}
          onSpeak={() => speakKazakh(current.kazakh)}
        />
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
