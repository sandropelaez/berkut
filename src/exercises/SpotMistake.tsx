import { useState } from "react";
import type { SpotMistakePrompt } from "@/core/types";
import ScriptText, { useKazakh } from "@/components/ScriptText";
import { speakKazakh } from "@/core/tts";
import { ChoiceTile, optionState, SpokenPrompt } from "@/components/ui";

const CHOICES = [
  { value: true, label: "Yes, that's right" },
  { value: false, label: "No, it's wrong" },
];

export default function SpotMistake({
  prompt,
  phase,
  onAnswer,
}: {
  prompt: SpotMistakePrompt;
  phase: "answering" | "checked";
  onAnswer: (correct: boolean) => void;
}) {
  const [picked, setPicked] = useState<boolean | null>(null);
  const kazakh = useKazakh();

  function choose(value: boolean) {
    if (phase !== "answering") return;
    setPicked(value);
    onAnswer(value === prompt.isCorrect);
  }

  return (
    <div className="space-y-6">
      <SpokenPrompt
        {...kazakh(prompt.sentenceKk)}
        instruction={`Does this mean “${prompt.meaningEn}”?`}
        size={/\s/.test(prompt.sentenceKk.trim()) ? "sentence" : "word"}
        onSpeak={() => speakKazakh(prompt.sentenceKk)}
      />

      <div className="grid grid-cols-2 gap-3">
        {CHOICES.map(({ value, label }) => (
          <ChoiceTile
            key={label}
            onClick={() => choose(value)}
            state={optionState(phase, picked === value, value === prompt.isCorrect)}
          >
            {label}
          </ChoiceTile>
        ))}
      </div>

      {phase === "checked" && prompt.fix && (
        <div className="rounded-tile bg-berkut-surface px-5 py-4" role="status">
          <div className="text-small text-berkut-ink-muted">“{prompt.fix.en}” is</div>
          <div lang="kk" className="text-title-md">
            <ScriptText>{prompt.fix.kk}</ScriptText>
          </div>
        </div>
      )}
    </div>
  );
}
