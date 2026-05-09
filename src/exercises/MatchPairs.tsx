import { useEffect, useMemo, useState } from "react";
import type { MatchPairsPrompt } from "@/core/types";
import ScriptText from "@/components/ScriptText";
import { speakKazakh } from "@/core/tts";

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

  function tileClass(t: Tile) {
    if (matched.has(t.id)) return "opacity-30 pointer-events-none";
    const isActive = t.id === activeKK || t.id === activeEN;
    const isWrong = wrongPair && (t.id === wrongPair[0] || t.id === wrongPair[1]);
    if (isWrong) return "border-berkut-error bg-berkut-error/10 animate-shake";
    if (isActive) return "border-berkut-primary bg-berkut-primary/10";
    return "border-berkut-border dark:border-berkut-border-dark hover:border-berkut-primary";
  }

  const left = tiles.filter((t) => t.side === "kk");
  const right = tiles.filter((t) => t.side === "en");

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-extrabold">Match the pairs</h2>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-3">
          {left.map((t) => (
            <button
              key={t.id}
              onClick={() => clickTile(t)}
              className={`w-full p-3 rounded-xl border-2 font-bold kk text-left transition ${tileClass(t)}`}
            >
              <ScriptText>{t.text}</ScriptText>
            </button>
          ))}
        </div>
        <div className="space-y-3">
          {right.map((t) => (
            <button
              key={t.id}
              onClick={() => clickTile(t)}
              className={`w-full p-3 rounded-xl border-2 font-bold text-left transition ${tileClass(t)}`}
            >
              {t.text}
            </button>
          ))}
        </div>
      </div>
      {phase === "answering" && matched.size < prompt.pairs.length * 2 && (
        <p className="text-sm text-center text-berkut-muted dark:text-berkut-muted-dark">
          {matched.size / 2} of {prompt.pairs.length} matched
          {mistakes > 0 ? ` · ${mistakes} mistake${mistakes === 1 ? "" : "s"}` : ""}
        </p>
      )}
    </div>
  );
}
