import { useState } from "react";
import type { ChooseReplyPrompt } from "@/core/types";
import ScriptText, { useKazakh } from "@/components/ScriptText";
import { speakKazakh } from "@/core/tts";
import { answersMatch } from "@/core/scoring";
import { ChoiceTile, IconButton, optionState } from "@/components/ui";

export default function ChooseReply({
  prompt,
  phase,
  onAnswer,
}: {
  prompt: ChooseReplyPrompt;
  phase: "answering" | "checked";
  onAnswer: (correct: boolean) => void;
}) {
  const [picked, setPicked] = useState<string | null>(null);
  const kazakh = useKazakh();
  const line = kazakh(prompt.lineKk);

  function choose(option: string) {
    if (phase !== "answering") return;
    setPicked(option);
    onAnswer(answersMatch(option, prompt.correctAns));
  }

  return (
    <div className="space-y-6">
      <h2 className="text-prompt text-berkut-ink-muted">Choose the best reply</h2>

      {/* The other speaker's line, as a chat bubble. */}
      <div className="flex items-end gap-3">
        <div className="max-w-[85%] rounded-tile rounded-bl-md bg-berkut-surface px-5 py-4">
          <div lang="kk" className="text-display-sentence break-words text-berkut-ink">
            {line.text}
          </div>
          {line.transliteration && <div className="text-translit text-berkut-ink-muted">{line.transliteration}</div>}
          {prompt.lineEn && phase === "checked" && (
            <div className="mt-1 text-small text-berkut-ink-muted">{prompt.lineEn}</div>
          )}
        </div>
        <IconButton icon="speaker" label="Play audio" tone="accent" onClick={() => speakKazakh(prompt.lineKk)} />
      </div>

      <div className="grid grid-cols-1 gap-3">
        {prompt.options.map((opt) => {
          const isCorrect = answersMatch(opt, prompt.correctAns);
          return (
            <ChoiceTile
              key={opt}
              lang="kk"
              align="start"
              onClick={() => choose(opt)}
              state={optionState(phase, picked === opt, isCorrect)}
            >
              <ScriptText>{opt}</ScriptText>
            </ChoiceTile>
          );
        })}
      </div>
    </div>
  );
}
