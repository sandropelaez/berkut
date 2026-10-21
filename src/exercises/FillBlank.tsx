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
      <h2 className="text-prompt text-berkut-ink-muted">Fill in the blank</h2>
      {prompt.hintEn && (
        <p className="text-small text-berkut-ink-muted">
          ({prompt.hintEn})
        </p>
      )}
      <div lang="kk" className="text-display-sentence !leading-[1.7]">
        <ScriptText>{before}</ScriptText>
        <span
          className={`inline-block min-w-[80px] mx-1 px-3 rounded-xl text-center ${
            picked
              ? "bg-berkut-turquoise-soft text-berkut-turquoise-ink shadow-[inset_0_-3px_0_rgb(var(--bk-turquoise-ink))]"
              : "bg-berkut-surface text-berkut-ink-muted shadow-[inset_0_-3px_0_rgb(var(--bk-line))]"
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
