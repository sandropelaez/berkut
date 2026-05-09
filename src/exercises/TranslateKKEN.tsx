import { useState } from "react";
import type { TranslateKKENPrompt } from "@/core/types";
import ScriptText from "@/components/ScriptText";
import { speakKazakh } from "@/core/tts";
import { answersMatch } from "@/core/scoring";

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
      <h2 className="text-xl font-extrabold">Translate to English</h2>

      <button
        onClick={() => speakKazakh(prompt.promptKk)}
        className="card w-full text-center hover:opacity-80 transition"
      >
        <span className="text-3xl font-extrabold kk">
          <ScriptText>{prompt.promptKk}</ScriptText>
        </span>
        <span className="ml-2">🔊</span>
      </button>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {prompt.options.map((opt) => {
          const isCorrect = answersMatch(opt, prompt.correctAns);
          const selected = picked === opt;
          const cls =
            phase === "answering"
              ? "btn-outline"
              : selected
                ? isCorrect
                  ? "btn-success"
                  : "btn-error"
                : isCorrect
                  ? "btn-success"
                  : "btn-outline opacity-40";
          return (
            <button key={opt} onClick={() => choose(opt)} className={cls}>
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}
