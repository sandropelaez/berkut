import { useMemo, useState } from "react";
import type { TranslateENKKPrompt } from "@/core/types";
import ScriptText from "@/components/ScriptText";
import { arraysMatch } from "@/core/scoring";
import { useStore } from "@/store/useStore";
import { toScript } from "@/core/transliterate";
import { Button } from "@/components/ui";

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
      <div className="flex flex-col gap-2">
        <h2 className="text-prompt text-berkut-ink-muted">Translate this sentence</h2>
        <p className="text-title-md">{prompt.promptEn}</p>
      </div>

      <div className="min-h-[96px] rounded-tile border-2 border-dashed border-berkut-line p-3 flex flex-wrap gap-2 items-start">
        {chosen.length === 0 ? (
          <span className="p-2 text-small text-berkut-ink-muted">
            Tap tiles below to build the answer
          </span>
        ) : (
          chosen.map((i, p) => (
            <button
              key={`c-${p}-${i}`}
              onClick={() => unpickIdx(p)}
              lang="kk"
              className="tile tile-selected !w-auto !min-h-12 !px-4"
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
            lang="kk"
            className="tile !w-auto !min-h-12 !px-4"
          >
            <ScriptText>{t}</ScriptText>
          </button>
        ))}
      </div>

      {phase === "answering" && (
        <Button size="lg" block onClick={check} disabled={chosen.length === 0}>
          Check
        </Button>
      )}
    </div>
  );
}
