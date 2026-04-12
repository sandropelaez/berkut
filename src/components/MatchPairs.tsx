"use client";

import { useState, useEffect, useMemo } from "react";
import { transliterate, type Script } from "@/lib/transliterate";

interface MatchPairsProps {
  pairs: [string, string][];
  script: Script;
  onComplete: (success: boolean) => void;
}

export default function MatchPairs({ pairs, script, onComplete }: MatchPairsProps) {
  const [leftSelected, setLeftSelected] = useState<number | null>(null);
  const [rightSelected, setRightSelected] = useState<string | null>(null);
  const [matched, setMatched] = useState<number[]>([]);
  const [wrong, setWrong] = useState<{ left: number; right: string } | null>(null);

  const shuffledRight = useMemo(() => {
    const r = pairs.map((p) => p[1]);
    for (let i = r.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [r[i], r[j]] = [r[j], r[i]];
    }
    return r;
  }, [pairs]);

  useEffect(() => {
    if (leftSelected !== null && rightSelected !== null) {
      const correctEnglish = pairs[leftSelected][1];
      if (correctEnglish === rightSelected) {
        const newMatched = [...matched, leftSelected];
        setMatched(newMatched);
        if (newMatched.length === pairs.length) {
          setTimeout(() => onComplete(true), 400);
        }
      } else {
        setWrong({ left: leftSelected, right: rightSelected });
        setTimeout(() => setWrong(null), 600);
      }
      setTimeout(() => {
        setLeftSelected(null);
        setRightSelected(null);
      }, 400);
    }
  }, [leftSelected, rightSelected, pairs, matched, onComplete]);

  return (
    <div className="flex gap-4 justify-center flex-wrap">
      <div className="flex flex-col gap-2.5 flex-1 min-w-[120px]">
        {pairs.map((p, i) => {
          const isMatched = matched.includes(i);
          const isSelected = leftSelected === i;
          const isWrong = wrong?.left === i;
          return (
            <button
              key={`l-${i}`}
              onClick={() => !isMatched && setLeftSelected(i)}
              disabled={isMatched}
              className={`px-4 py-3 rounded-xl border-2 text-[15px] font-medium text-center transition-all font-sans
                ${isMatched ? "border-berkut-success bg-berkut-success-light opacity-50 cursor-default" :
                  isSelected ? "border-berkut-sky bg-berkut-sky-light" :
                  isWrong ? "border-berkut-error bg-berkut-error-light animate-shake" :
                  "border-gray-200 bg-white hover:border-gray-300 cursor-pointer"}`}
            >
              {transliterate(p[0], script)}
            </button>
          );
        })}
      </div>
      <div className="flex flex-col gap-2.5 flex-1 min-w-[120px]">
        {shuffledRight.map((eng, i) => {
          const isMatched = matched.some((mi) => pairs[mi][1] === eng);
          const isSelected = rightSelected === eng;
          const isWrong = wrong?.right === eng;
          return (
            <button
              key={`r-${i}`}
              onClick={() => !isMatched && setRightSelected(eng)}
              disabled={isMatched}
              className={`px-4 py-3 rounded-xl border-2 text-[15px] font-medium text-center transition-all
                ${isMatched ? "border-berkut-success bg-berkut-success-light opacity-50 cursor-default" :
                  isSelected ? "border-berkut-sky bg-berkut-sky-light" :
                  isWrong ? "border-berkut-error bg-berkut-error-light animate-shake" :
                  "border-gray-200 bg-white hover:border-gray-300 cursor-pointer"}`}
            >
              {eng}
            </button>
          );
        })}
      </div>
    </div>
  );
}
