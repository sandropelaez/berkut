import { useState } from "react";
import type { TranslateKKENPrompt } from "@/core/types";
import ScriptText from "@/components/ScriptText";
import { speakKazakh } from "@/core/tts";
import { answersMatch } from "@/core/scoring";
import { ChoiceTile, optionState, SpokenPrompt } from "@/components/ui";

export default function TranslateKKEN({
  prompt,
  phase,
  onAnswer,
}: {
  prompt: TranslateKKENPrompt;
  phase: "answering" | "checked";
  onAnswer: (correct: boolean) => void;
}) {
  const [picked, setPicked] = useState<string | null>(null);

  function choose(option: string) {
    if (phase !== "answering") return;
    setPicked(option);
    onAnswer(answersMatch(option, prompt.correctAns));
  }

  return (
    <div className="space-y-6">
      <h2 className="font-sans text-[17px] leading-[26px] font-medium tracking-normal text-berkut-muted">Translate to English</h2>

      <SpokenPrompt onSpeak={() => speakKazakh(prompt.promptKk)} size="sentence">
        <ScriptText>{prompt.promptKk}</ScriptText>
      </SpokenPrompt>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {prompt.options.map((opt) => {
          const isCorrect = answersMatch(opt, prompt.correctAns);
          const selected = picked === opt;
          return (
            <ChoiceTile key={opt} onClick={() => choose(opt)} state={optionState(phase, selected, isCorrect)}>
              {opt}
            </ChoiceTile>
          );
        })}
      </div>
    </div>
  );
}
