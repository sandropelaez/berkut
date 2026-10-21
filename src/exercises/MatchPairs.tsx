import { useEffect, useMemo, useState } from "react";
import type { MatchPairsPrompt } from "@/core/types";
import ScriptText from "@/components/ScriptText";
import { speakKazakh } from "@/core/tts";
import { ChoiceTile, type TileState } from "@/components/ui";

interface Tile {
  id: string;
  side: "kk" | "en";
  pairId: string;
  text: string;
}

export default function MatchPairs({
  prompt,
  phase,
  onAnswer,
}: {
  prompt: MatchPairsPrompt;
  phase: "answering" | "checked";
  onAnswer: (correct: boolean) => void;
}) {
  const tiles: Tile[] = useMemo(() => {
    const arr: Tile[] = [];
    prompt.pairs.forEach((p, i) => {
      arr.push({ id: `kk-${i}`, side: "kk", pairId: `p-${i}`, text: p.kazakh });
      arr.push({ id: `en-${i}`, side: "en", pairId: `p-${i}`, text: p.english });
    });
    return arr.sort(() => Math.random() - 0.5);
  }, [prompt]);

  const [matched, setMatched] = useState<Set<string>>(new Set());
  const [activeKK, setActiveKK] = useState<string | null>(null);
  const [activeEN, setActiveEN] = useState<string | null>(null);
  const [wrongPair, setWrongPair] = useState<[string, string] | null>(null);
  const [mistakes, setMistakes] = useState(0);

  useEffect(() => {
    if (matched.size === prompt.pairs.length * 2 && phase === "answering") {
      onAnswer(mistakes === 0);
    }
  }, [matched, mistakes, prompt.pairs.length, phase, onAnswer]);

  function clickTile(t: Tile) {
    if (phase !== "answering") return;
    if (matched.has(t.id)) return;

    if (t.side === "kk") {
      speakKazakh(t.text);
      setActiveKK(t.id === activeKK ? null : t.id);
    } else {
      setActiveEN(t.id === activeEN ? null : t.id);
    }
  }

  useEffect(() => {
    if (!activeKK || !activeEN) return;
    const kk = tiles.find((t) => t.id === activeKK)!;
    const en = tiles.find((t) => t.id === activeEN)!;

    if (kk.pairId === en.pairId) {
      const next = new Set(matched);
      next.add(kk.id);
      next.add(en.id);
      setMatched(next);
      setActiveKK(null);
      setActiveEN(null);
    } else {
      setWrongPair([activeKK, activeEN]);
      setMistakes((m) => m + 1);
      setTimeout(() => {
        setActiveKK(null);
        setActiveEN(null);
        setWrongPair(null);
      }, 600);
    }
  }, [activeKK, activeEN, tiles, matched]);

  function tileState(t: Tile): TileState {
    if (matched.has(t.id)) return "correct";
    if (wrongPair && (t.id === wrongPair[0] || t.id === wrongPair[1])) return "wrong";
    if (t.id === activeKK || t.id === activeEN) return "selected";
    return "idle";
  }

  const left = tiles.filter((t) => t.side === "kk");
  const right = tiles.filter((t) => t.side === "en");

  return (
    <div className="space-y-6">
      <h2 className="text-prompt text-berkut-ink-muted">Match the pairs</h2>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-3">
          {left.map((t) => (
            <ChoiceTile
              key={t.id}
              lang="kk"
              align="start"
              state={tileState(t)}
              disabled={matched.has(t.id)}
              onClick={() => clickTile(t)}
              className="disabled:opacity-60"
            >
              <ScriptText>{t.text}</ScriptText>
            </ChoiceTile>
          ))}
        </div>
        <div className="space-y-3">
          {right.map((t) => (
            <ChoiceTile
              key={t.id}
              align="start"
              state={tileState(t)}
              disabled={matched.has(t.id)}
              onClick={() => clickTile(t)}
              className="disabled:opacity-60"
            >
              {t.text}
            </ChoiceTile>
          ))}
        </div>
      </div>
      {phase === "answering" && matched.size < prompt.pairs.length * 2 && (
        <p className="text-small text-center text-berkut-ink-muted tabular-nums">
          {matched.size / 2} of {prompt.pairs.length} matched
          {mistakes > 0 ? ` · ${mistakes} mistake${mistakes === 1 ? "" : "s"}` : ""}
        </p>
      )}
    </div>
  );
}
