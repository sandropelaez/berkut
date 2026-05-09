import { useEffect, useState } from "react";
import type { ListeningPrompt } from "@/core/types";
import ScriptText from "@/components/ScriptText";
import { speakKazakh, ttsSupported } from "@/core/tts";
import { answersMatch } from "@/core/scoring";

export default function Listening({
  prompt,
  phase,
  onAnswer,
}: {
  prompt: ListeningPrompt;
  phase: "answering" | "checked";
  onAnswer: (correct: boolean) => void;
}) {
  const [picked, setPicked] = useState<string | null>(null);

  useEffect(() => {
    const t = setTimeout(() => speakKazakh(prompt.audioKk), 220);
    return () => clearTimeout(t);
  }, [prompt.audioKk]);

  function choose(option: string) {
    if (phase !== "answering") return;
    setPicked(option);
    onAnswer(answersMatch(option, prompt.correctAns));
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-extrabold">Tap what you hear</h2>

      <div className="flex flex-col items-center gap-3">
        <button
          onClick={() => speakKazakh(prompt.audioKk)}
          className="h-24 w-24 rounded-full bg-berkut-primary text-white text-4xl flex items-center justify-center shadow-[0_4px_0_0_#0096B7]"
          aria-label="Play audio"
        >
          🔊
        </button>
        <button
          onClick={() => speakKazakh(prompt.audioKk, { rate: 0.6 })}
          className="text-sm font-semibold text-berkut-primary hover:underline"
        >
          🐢 Slower
        </button>
        {!ttsSupported() && (
          <p className="text-xs text-berkut-muted dark:text-berkut-muted-dark text-center">
            Audio unavailable — use the printed text below.
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {prompt.options.map((opt) => {
          const isCorrect = answersMatch(opt, prompt.correctAns);
          const selected = picked === opt;
          const cls =
            phase === "answering"
              ? "btn-outline kk text-lg"
              : `kk text-lg ${
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
