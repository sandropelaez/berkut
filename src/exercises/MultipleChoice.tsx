import { useState } from "react";
import type { MultipleChoicePrompt } from "@/core/types";
import ScriptText from "@/components/ScriptText";
import { speakKazakh } from "@/core/tts";
import { answersMatch } from "@/core/scoring";
import { ChoiceTile, optionState, SpokenPrompt } from "@/components/ui";

export default function MultipleChoice({
  prompt,
  phase,
  onAnswer,
}: {
  prompt: MultipleChoicePrompt;
  phase: "answering" | "checked";
  onAnswer: (correct: boolean, vocabIds?: string[]) => void;
}) {
  const [picked, setPicked] = useState<string | null>(null);

  function choose(option: string) {
    if (phase !== "answering") return;
    setPicked(option);
    onAnswer(answersMatch(option, prompt.correctAns));
  }

  return (
    <div className="space-y-6">
      <h2 className="font-sans text-[17px] leading-[26px] font-medium tracking-normal text-berkut-muted">
        {prompt.questionEn ?? "Choose the correct answer"}
      </h2>

      {prompt.promptKk && (
        <SpokenPrompt onSpeak={() => speakKazakh(prompt.promptKk!)}>
          <ScriptText>{prompt.promptKk}</ScriptText>
        </SpokenPrompt>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {prompt.options.map((opt) => {
          const isCorrect = answersMatch(opt, prompt.correctAns);
          const selected = picked === opt;
          return (
            <ChoiceTile
              key={opt}
              onClick={() => choose(opt)}
              state={optionState(phase, selected, isCorrect)}
              lang={prompt.scriptOptions === "kk" ? "kk" : "en"}
            >
              {prompt.scriptOptions === "kk" ? <ScriptText>{opt}</ScriptText> : opt}
            </ChoiceTile>
          );
        })}
      </div>
    </div>
  );
}
