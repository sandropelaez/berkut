import { useMemo, useState } from "react";
import type { TranslateENKKPrompt } from "@/core/types";
import ScriptText from "@/components/ScriptText";
import { arraysMatch } from "@/core/scoring";
import { useStore } from "@/store/useStore";
import { toScript } from "@/core/transliterate";

export default function TranslateENKK({
  prompt,
  phase,
  onAnswer,
}: {
  prompt: TranslateENKKPrompt;
  phase: "answering" | "checked";
  onAnswer: (correct: boolean) => void;
}) {
  const script = useStore((s) => s.scriptPref);
  const tiles = useMemo(
    () => [...prompt.tiles].sort(() => Math.random() - 0.5),
    [prompt],
  );
  const [chosen, setChosen] = useState<number[]>([]);

  function pickTile(i: number) {
    if (phase !== "answering") return;
    if (chosen.includes(i)) return;
    setChosen([...chosen, i]);
  }
  function unpickIdx(positionInChosen: number) {
    if (phase !== "answering") return;
    setChosen(chosen.filter((_, p) => p !== positionInChosen));
  }
  function check() {
    if (phase !== "answering") return;
    const guess = chosen.map((i) => tiles[i]!);
    onAnswer(arraysMatch(guess, prompt.correctAns));
  }

  const remainingTiles = tiles
    .map((t, i) => ({ t, i }))
    .filter(({ i }) => !chosen.includes(i));

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-extrabold">
        Translate this sentence
      </h2>
      <div className="card text-center">
        <div className="text-2xl font-bold">{prompt.promptEn}</div>
      </div>

      <div className="card min-h-[80px] flex flex-wrap gap-2 items-start">
        {chosen.length === 0 ? (
          <span className="text-berkut-muted dark:text-berkut-muted-dark italic">
            Tap tiles below to build the answer
          </span>
        ) : (
          chosen.map((i, p) => (
            <button
              key={`c-${p}-${i}`}
              onClick={() => unpickIdx(p)}
              className="px-3 py-2 rounded-xl border-2 border-berkut-primary bg-berkut-primary/10 font-bold kk"
            >
              {toScript(tiles[i]!, script)}
            </button>
          ))
        )}
      </div>

      <div className="flex flex-wrap gap-2 justify-center">
        {remainingTiles.map(({ t, i }) => (
          <button
            key={`t-${i}`}
            onClick={() => pickTile(i)}
            className="px-3 py-2 rounded-xl border-2 border-berkut-border dark:border-berkut-border-dark bg-white dark:bg-berkut-card-dark font-bold kk hover:border-berkut-primary"
          >
            <ScriptText>{t}</ScriptText>
          </button>
        ))}
      </div>

      {phase === "answering" && (
        <button
          onClick={check}
          disabled={chosen.length === 0}
          className="btn-primary w-full"
        >
          Check
        </button>
      )}
    </div>
  );
}
