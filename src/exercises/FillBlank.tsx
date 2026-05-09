import { useState } from "react";
import type { FillBlankPrompt } from "@/core/types";
import ScriptText from "@/components/ScriptText";
import { answersMatch } from "@/core/scoring";

export default function FillBlank({
  prompt,
  phase,
  onAnswer,
}: {
  prompt: FillBlankPrompt;
  phase: "answering" | "checked";
  onAnswer: (correct: boolean) => void;
}) {
  const [picked, setPicked] = useState<string | null>(null);

  function choose(opt: string) {
    if (phase !== "answering") return;
    setPicked(opt);
    onAnswer(answersMatch(opt, prompt.correctAns));
  }

  const [before, after] = prompt.sentenceKkParts;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-extrabold">Fill in the blank</h2>
      {prompt.hintEn && (
        <p className="text-sm text-berkut-muted dark:text-berkut-muted-dark italic">
          ({prompt.hintEn})
        </p>
      )}
      <div className="card text-center text-2xl font-bold kk leading-relaxed">
        <ScriptText>{before}</ScriptText>
        <span
          className={`inline-block min-w-[80px] mx-1 px-3 py-1 rounded-lg border-b-4 ${
            picked
              ? "border-berkut-primary bg-berkut-primary/10"
              : "border-berkut-muted/40 bg-berkut-muted/10"
          }`}
        >
          {picked ? <ScriptText>{picked}</ScriptText> : "____"}
        </span>
        <ScriptText>{after}</ScriptText>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {prompt.options.map((opt) => {
          const isCorrect = answersMatch(opt, prompt.correctAns);
          const selected = picked === opt;
          const cls =
            phase === "answering"
              ? "btn-outline kk"
              : `kk ${
                  selected
                    ? isCorrect
                      ? "btn-success"
                      : "btn-error"
                    : isCorrect
                      ? "btn-success"
                      : "btn-outline opacity-40"
                }`;
          return (
            <button key={opt} onClick={() => choose(opt)} className={cls}>
              <ScriptText>{opt}</ScriptText>
            </button>
          );
        })}
      </div>
    </div>
  );
}
