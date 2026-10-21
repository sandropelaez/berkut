import { useState } from "react";
import type { MultipleChoicePrompt } from "@/core/types";
import ScriptText, { useKazakh } from "@/components/ScriptText";
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
  const kazakh = useKazakh();
  const instruction = prompt.questionEn ?? "Choose the correct answer";

  function choose(option: string) {
    if (phase !== "answering") return;
    setPicked(option);
    onAnswer(answersMatch(option, prompt.correctAns));
  }

  return (
    <div className="space-y-6">
      {prompt.promptKk ? (
        <SpokenPrompt
          {...kazakh(prompt.promptKk)}
          instruction={instruction}
          size={/\s/.test(prompt.promptKk.trim()) ? "sentence" : "word"}
          onSpeak={() => speakKazakh(prompt.promptKk!)}
        />
      ) : (
        <h2 className="text-prompt text-berkut-ink-muted">{instruction}</h2>
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
              lang={prompt.scriptOptions === "kk" ? "kk" : undefined}
            >
              {prompt.scriptOptions === "kk" ? <ScriptText>{opt}</ScriptText> : opt}
            </ChoiceTile>
          );
        })}
      </div>
    </div>
  );
}
