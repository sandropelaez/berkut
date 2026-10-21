import { useState } from "react";
import type { FillBlankPrompt } from "@/core/types";
import ScriptText from "@/components/ScriptText";
import { answersMatch } from "@/core/scoring";
import { ChoiceTile, optionState } from "@/components/ui";

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
      <h2 className="font-sans text-[17px] leading-[26px] font-medium tracking-normal text-berkut-muted">Fill in the blank</h2>
      {prompt.hintEn && (
        <p className="text-sm text-berkut-muted dark:text-berkut-muted-dark italic">
          ({prompt.hintEn})
        </p>
      )}
      <div className="card text-center font-display font-medium text-2xl leading-[1.7]">
        <ScriptText>{before}</ScriptText>
        <span
          className={`inline-block min-w-[80px] mx-1 px-3 py-1 rounded-lg border-b-4 ${
            picked
              ? "border-berkut-sky bg-berkut-sky-soft"
              : "border-berkut-line-strong bg-berkut-sunk"
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
          return (
            <ChoiceTile key={opt} lang="kk" onClick={() => choose(opt)} state={optionState(phase, selected, isCorrect)}>
              <ScriptText>{opt}</ScriptText>
            </ChoiceTile>
          );
        })}
      </div>
    </div>
  );
}
