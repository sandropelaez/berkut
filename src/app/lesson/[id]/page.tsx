"use client";

import { useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { transliterate } from "@/lib/transliterate";
import { getLesson, UNITS } from "@/data/units";
import { HeartIcon } from "@/components/Icons";
import Confetti from "@/components/Confetti";
import MatchPairs from "@/components/MatchPairs";
import type { LessonScore } from "@/lib/types";

export default function LessonPage() {
  const params = useParams();
  const router = useRouter();
  const store = useStore();
  const lessonId = Number(params.id);
  const found = getLesson(lessonId);

  const [exIndex, setExIndex] = useState(0);
  const [hearts, setHearts] = useState(3);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answerState, setAnswerState] = useState<"correct" | "incorrect" | null>(null);
  const [score, setScore] = useState<LessonScore>({ correct: 0, total: 0, xpEarned: 0, mistakes: 0 });
  const [showConfetti, setShowConfetti] = useState(false);
  const [selectedTiles, setSelectedTiles] = useState<string[]>([]);
  const [done, setDone] = useState(false);

  if (!found) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400">Lesson not found</p>
      </div>
    );
  }

  const { lesson, unit } = found;
  const exercise = lesson.exercises[exIndex];
  const T = (text: string) => transliterate(text, store.scriptPref);
  const progress = (exIndex / lesson.exercises.length) * 100;
  const isMatch = exercise?.type === "MATCH_PAIRS";
  const isTileTranslate = exercise?.type === "TRANSLATE_EN_KK";

  const finishLesson = (finalScore: LessonScore) => {
    const bonus = 20;
    const perfectBonus = finalScore.correct === finalScore.total ? 30 : 0;
    const totalXp = finalScore.xpEarned + bonus + perfectBonus;

    store.addXp(totalXp);
    store.addGems(5);
    store.completeLesson(lessonId, {
      ...finalScore,
      xpEarned: totalXp,
    });
    store.updateStreak();
    store.awardBadge("first_lesson");
    if (finalScore.correct === finalScore.total) store.awardBadge("perfect_round");

    // Check unit completion
    const allDone = unit.lessons.every(
      (l) => store.completedLessons[l.id] || l.id === lessonId
    );
    if (allDone && unit.id === 3) store.awardBadge("polyglot");

    setScore((s) => ({ ...s, xpEarned: totalXp }));
    setDone(true);
  };

  const checkAnswer = (answer: string) => {
    if (answerState) return;
    setSelectedAnswer(answer);
    const isCorrect = answer === exercise.correctAns;
    setAnswerState(isCorrect ? "correct" : "incorrect");

    if (isCorrect) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 1200);
      setScore((s) => ({
        ...s,
        correct: s.correct + 1,
        total: s.total + 1,
        xpEarned: s.xpEarned + 10,
      }));
    } else {
      setHearts((h) => h - 1);
      setScore((s) => ({
        ...s,
        total: s.total + 1,
        mistakes: s.mistakes + 1,
      }));
    }
  };

  const nextExercise = () => {
    if (hearts <= 0) {
      finishLesson(score);
      return;
    }
    if (exIndex + 1 >= lesson.exercises.length) {
      finishLesson(score);
    } else {
      setExIndex((i) => i + 1);
      setSelectedAnswer(null);
      setAnswerState(null);
      setSelectedTiles([]);
    }
  };

  const handleTileSelect = (tile: string) => {
    if (answerState) return;
    setSelectedTiles((prev) =>
      prev.includes(tile) ? prev.filter((t) => t !== tile) : [...prev, tile]
    );
  };

  const submitTiles = () => {
    checkAnswer(selectedTiles.join(" "));
  };

  // ========== LESSON COMPLETE SCREEN ==========
  if (done) {
    const accuracy = score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0;
    const stars = accuracy >= 90 ? 3 : accuracy >= 70 ? 2 : accuracy >= 50 ? 1 : 0;

    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 py-10 text-center bg-berkut-bg">
        <div className="text-5xl mb-4">
          {hearts <= 0 ? "💔" : stars === 3 ? "🌟" : "🎉"}
        </div>
        <h1 className="text-[28px] font-extrabold text-berkut-dark font-display">
          {hearts <= 0 ? "Out of Hearts!" : "Lesson Complete!"}
        </h1>

        {/* Stars */}
        <div className="flex gap-2 my-4">
          {[1, 2, 3].map((i) => (
            <span
              key={i}
              className={`text-4xl transition-all ${
                i <= stars ? "" : "grayscale opacity-30"
              }`}
            >
              ⭐
            </span>
          ))}
        </div>

        {/* Score card */}
        <div className="bg-white rounded-2xl p-5 shadow-sm w-full max-w-[300px] space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-500">Accuracy</span>
            <span className="font-semibold">{accuracy}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">XP earned</span>
            <span className="font-semibold text-berkut-sky">+{score.xpEarned}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Correct</span>
            <span className="font-semibold text-berkut-success">
              {score.correct}/{score.total}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Gems</span>
            <span className="font-semibold text-berkut-sky">+5 💎</span>
          </div>
        </div>

        <button
          onClick={() => router.push("/")}
          className="w-full max-w-[300px] mt-6 py-3.5 rounded-2xl bg-berkut-sky text-white font-bold text-base hover:bg-berkut-sky-dark active:scale-[0.98] transition-all"
        >
          Continue
        </button>
      </div>
    );
  }

  // ========== EXERCISE SCREEN ==========
  if (!exercise) return null;

  return (
    <div className="min-h-screen bg-white relative">
      {showConfetti && <Confetti />}

      {/* Header: close, progress, hearts */}
      <div className="px-5 py-4 flex items-center gap-3">
        <button
          onClick={() => router.push("/")}
          className="text-xl text-gray-400 hover:text-gray-600 transition-colors p-1"
        >
          ✕
        </button>
        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-berkut-sky rounded-full transition-all duration-400"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <HeartIcon key={i} filled={i < hearts} />
          ))}
        </div>
      </div>

      {/* Exercise body */}
      <div className="px-6 pb-32 min-h-[400px]">
        {/* Type label */}
        <p className="text-[13px] text-gray-400 uppercase tracking-wider font-semibold mb-2">
          {exercise.type === "MULTIPLE_CHOICE" && "Choose the correct answer"}
          {exercise.type === "TRANSLATE_EN_KK" &&
            `Translate to Kazakh (${store.scriptPref === "CYRILLIC" ? "Кириллица" : "Latyn"})`}
          {exercise.type === "TRANSLATE_KK_EN" && "Translate to English"}
          {exercise.type === "FILL_BLANK" && "Fill in the blank"}
          {exercise.type === "MATCH_PAIRS" && "Match the pairs"}
        </p>

        {/* Prompt */}
        {!isMatch && (
          <h2 className="text-2xl font-bold text-berkut-dark leading-snug mb-8 font-sans">
            {exercise.type === "FILL_BLANK" || exercise.type === "TRANSLATE_KK_EN"
              ? T(exercise.prompt.text || "")
              : exercise.prompt.text}
            {exercise.prompt.hint && (
              <span className="block text-sm text-gray-400 font-normal mt-1">
                Hint: {exercise.prompt.hint}
              </span>
            )}
          </h2>
        )}

        {/* Match Pairs */}
        {isMatch && exercise.prompt.pairs && (
          <MatchPairs
            pairs={exercise.prompt.pairs}
            script={store.scriptPref}
            onComplete={(success) => {
              if (success) {
                setShowConfetti(true);
                setTimeout(() => setShowConfetti(false), 1200);
                setScore((s) => ({
                  ...s,
                  correct: s.correct + 1,
                  total: s.total + 1,
                  xpEarned: s.xpEarned + 10,
                }));
                setAnswerState("correct");
              }
            }}
          />
        )}

        {/* Tile Translation */}
        {isTileTranslate && !answerState && (
          <div>
            <div className="min-h-[52px] px-4 py-3 border-2 border-dashed border-gray-200 rounded-2xl mb-5 flex flex-wrap gap-2 items-center">
              {selectedTiles.length === 0 && (
                <span className="text-gray-300 text-[15px]">Tap tiles to build your answer…</span>
              )}
              {selectedTiles.map((t, i) => (
                <span
                  key={i}
                  onClick={() => handleTileSelect(t)}
                  className="px-3.5 py-2 bg-berkut-sky-light rounded-xl cursor-pointer text-[15px] font-medium font-sans hover:bg-berkut-sky/20 transition-colors"
                >
                  {T(t)}
                </span>
              ))}
            </div>
            <div className="flex flex-wrap gap-2.5 justify-center">
              {(exercise.tiles || []).map((tile, i) => (
                <button
                  key={i}
                  onClick={() => handleTileSelect(tile)}
                  disabled={selectedTiles.includes(tile)}
                  className={`px-4 py-2.5 rounded-xl border-2 text-base font-medium font-sans transition-all ${
                    selectedTiles.includes(tile)
                      ? "border-gray-100 bg-gray-50 opacity-40 cursor-default"
                      : "border-gray-200 bg-white hover:border-gray-300 cursor-pointer active:scale-95"
                  }`}
                >
                  {T(tile)}
                </button>
              ))}
            </div>
            <button
              onClick={submitTiles}
              disabled={selectedTiles.length === 0}
              className={`w-full mt-6 py-3.5 rounded-2xl font-bold text-base text-white transition-all ${
                selectedTiles.length > 0
                  ? "bg-berkut-sky hover:bg-berkut-sky-dark active:scale-[0.98]"
                  : "bg-gray-300 cursor-not-allowed"
              }`}
            >
              Check
            </button>
          </div>
        )}

        {/* Tile feedback */}
        {isTileTranslate && answerState && (
          <div
            className={`p-4 rounded-2xl mt-4 border-2 ${
              answerState === "correct"
                ? "bg-berkut-success-light border-berkut-success"
                : "bg-berkut-error-light border-berkut-error"
            }`}
          >
            <p
              className={`font-semibold ${
                answerState === "correct" ? "text-emerald-700" : "text-rose-700"
              }`}
            >
              {answerState === "correct"
                ? "Correct! +10 XP"
                : `Incorrect. Answer: ${T(exercise.correctAns || "")}`}
            </p>
          </div>
        )}

        {/* Multiple Choice / KK→EN / Fill Blank */}
        {!isMatch && !isTileTranslate && (
          <div className="flex flex-col gap-3">
            {(exercise.options || []).map((opt, i) => {
              const isSelected = selectedAnswer === opt;
              const isCorrectOpt = opt === exercise.correctAns;
              let classes =
                "px-5 py-4 rounded-2xl border-2 text-base font-medium text-left transition-all font-sans";
              if (answerState) {
                if (isCorrectOpt) {
                  classes += " border-berkut-success bg-berkut-success-light";
                } else if (isSelected && !isCorrectOpt) {
                  classes += " border-berkut-error bg-berkut-error-light animate-shake";
                } else {
                  classes += " border-gray-200 bg-white opacity-60";
                }
              } else {
                classes +=
                  " border-gray-200 bg-white hover:border-gray-300 cursor-pointer active:scale-[0.98]";
              }
              return (
                <button key={i} onClick={() => checkAnswer(opt)} className={classes}>
                  {exercise.type === "TRANSLATE_KK_EN" ? opt : T(opt)}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Bottom feedback + continue */}
      {answerState && (
        <div
          className={`fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] px-6 pb-6 pt-4 border-t-2 animate-slide-up ${
            answerState === "correct"
              ? "bg-berkut-success-light border-berkut-success"
              : "bg-berkut-error-light border-berkut-error"
          }`}
        >
          {!isTileTranslate && (
            <p
              className={`mb-3 font-semibold text-base ${
                answerState === "correct" ? "text-emerald-700" : "text-rose-700"
              }`}
            >
              {answerState === "correct"
                ? "Correct! +10 XP"
                : `Correct answer: ${
                    exercise.type === "TRANSLATE_KK_EN"
                      ? exercise.correctAns
                      : T(exercise.correctAns || "")
                  }`}
            </p>
          )}
          <button
            onClick={nextExercise}
            className={`w-full py-3.5 rounded-2xl font-bold text-white text-base transition-all active:scale-[0.98] ${
              answerState === "correct" ? "bg-berkut-success" : "bg-berkut-error"
            }`}
          >
            {hearts <= 0 && answerState === "incorrect"
              ? "End Lesson"
              : exIndex + 1 >= lesson.exercises.length
              ? "Finish!"
              : "Continue"}
          </button>
        </div>
      )}
    </div>
  );
}
