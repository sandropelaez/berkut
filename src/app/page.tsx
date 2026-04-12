"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { transliterate } from "@/lib/transliterate";
import { UNITS } from "@/data/units";
import { StreakIcon, GemIcon } from "@/components/Icons";
import BottomTabs from "@/components/BottomTabs";

export default function HomePage() {
  const router = useRouter();
  const store = useStore();

  useEffect(() => {
    if (!store.hasOnboarded) {
      router.replace("/welcome");
    }
  }, [store.hasOnboarded, router]);

  if (!store.hasOnboarded) return null;

  const T = (text: string) => transliterate(text, store.scriptPref);

  return (
    <div className="pb-24">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-gray-100 px-5 py-3 flex items-center justify-between">
        <span className="text-[22px] font-extrabold text-berkut-sky font-display tracking-tight">
          🦅 Berkut
        </span>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-sm font-semibold text-orange-500">
            <StreakIcon /> {store.streakCount}
          </span>
          <span className="flex items-center gap-1 text-sm font-semibold text-berkut-sky">
            <GemIcon /> {store.gems}
          </span>
          <Link href="/shop" className="text-base hover:scale-110 transition-transform">
            🛒
          </Link>
        </div>
      </header>

      {/* XP progress */}
      <div className="bg-white px-5 py-3">
        <div className="flex justify-between mb-1">
          <span className="text-[13px] text-gray-500">Daily XP</span>
          <span className="text-[13px] font-semibold text-berkut-sky">
            {store.xpWeekly} XP
          </span>
        </div>
        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-berkut-sky to-berkut-gold transition-all duration-500"
            style={{ width: `${Math.min(100, (store.xpWeekly / 200) * 100)}%` }}
          />
        </div>
      </div>

      {/* Skill Tree */}
      <div className="px-5 pt-5 space-y-2">
        {UNITS.map((unit, ui) => {
          const completedInUnit = unit.lessons.filter(
            (l) => store.completedLessons[l.id]
          ).length;
          const unitComplete = completedInUnit === unit.lessons.length;
          const prevUnitComplete =
            ui === 0 ||
            UNITS[ui - 1].lessons.every((l) => store.completedLessons[l.id]);
          const isLocked = ui > 0 && !prevUnitComplete;

          return (
            <div key={unit.id}>
              {/* Unit card */}
              <div
                className={`rounded-2xl p-5 mb-1 shadow-sm transition-all ${
                  isLocked
                    ? "bg-gray-50 border border-gray-200 opacity-60"
                    : unitComplete
                    ? "bg-gradient-to-br from-berkut-success-light to-white border border-berkut-success/30"
                    : "bg-white border border-berkut-sky/20"
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-xl text-white font-bold shrink-0 ${
                      unitComplete
                        ? "bg-berkut-success"
                        : isLocked
                        ? "bg-gray-300"
                        : "bg-gradient-to-br from-berkut-sky to-berkut-gold"
                    }`}
                  >
                    {unitComplete ? "✓" : isLocked ? "🔒" : unit.order}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-[17px] font-bold text-berkut-dark leading-tight">
                      {T(unit.titleKk)}
                    </h3>
                    <p className="text-[13px] text-gray-500">{unit.titleEn}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[11px] px-2 py-0.5 rounded-md bg-berkut-sky/10 text-berkut-sky font-semibold">
                        {unit.cefrLevel}
                      </span>
                      <span className="text-[12px] text-gray-400">
                        {completedInUnit}/{unit.lessons.length} lessons
                      </span>
                    </div>
                  </div>
                  <Link
                    href={`/cultural/${unit.id}`}
                    className="text-lg hover:scale-110 transition-transform p-1"
                    title="Cultural note"
                  >
                    🏔️
                  </Link>
                </div>
                {/* Progress bar */}
                <div className="mt-3 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      unitComplete ? "bg-berkut-success" : "bg-berkut-sky"
                    }`}
                    style={{
                      width: `${(completedInUnit / unit.lessons.length) * 100}%`,
                    }}
                  />
                </div>
              </div>

              {/* Lessons */}
              {!isLocked && (
                <div className="pl-6 relative">
                  <div className="absolute left-[46px] top-0 bottom-3 w-0.5 bg-gray-200" />
                  {unit.lessons.map((lesson, li) => {
                    const isComplete = !!store.completedLessons[lesson.id];
                    const prevComplete =
                      li === 0 || !!store.completedLessons[unit.lessons[li - 1].id];
                    const lessonLocked = li > 0 && !prevComplete;
                    const score = store.completedLessons[lesson.id]?.score;

                    return (
                      <div
                        key={lesson.id}
                        className="flex items-center gap-3 py-2 relative"
                      >
                        <div
                          className={`w-9 h-9 rounded-full shrink-0 flex items-center justify-center text-sm font-bold border-2 z-[1] ${
                            isComplete
                              ? "bg-berkut-success border-berkut-success text-white"
                              : lessonLocked
                              ? "bg-gray-100 border-gray-300 text-gray-400"
                              : "bg-white border-berkut-sky text-berkut-sky"
                          }`}
                        >
                          {isComplete ? "✓" : lesson.order}
                        </div>
                        <Link
                          href={lessonLocked ? "#" : `/lesson/${lesson.id}`}
                          className={`flex-1 px-4 py-3 rounded-xl text-left border transition-all ${
                            isComplete
                              ? "border-berkut-success/30 bg-berkut-success/5"
                              : lessonLocked
                              ? "border-gray-100 bg-gray-50 opacity-50 pointer-events-none"
                              : "border-berkut-sky/20 bg-white hover:border-berkut-sky/40 hover:shadow-sm"
                          }`}
                          onClick={(e) => lessonLocked && e.preventDefault()}
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="text-[15px] font-semibold text-berkut-dark">
                                {T(lesson.titleKk)}
                              </p>
                              <p className="text-[13px] text-gray-400">
                                {lesson.titleEn}
                              </p>
                            </div>
                            {score != null && (
                              <span
                                className={`text-[13px] font-semibold ${
                                  score >= 90
                                    ? "text-berkut-success"
                                    : score >= 70
                                    ? "text-berkut-gold"
                                    : "text-berkut-error"
                                }`}
                              >
                                {score}%
                              </span>
                            )}
                          </div>
                        </Link>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        {/* Future units teaser */}
        {[4, 5, 6, 7, 8, 9, 10].map((n) => (
          <div
            key={n}
            className="rounded-2xl p-5 shadow-sm bg-gray-50 border border-gray-200 opacity-40 flex items-center gap-3.5"
          >
            <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-lg text-gray-500">
              🔒
            </div>
            <div>
              <h3 className="text-[15px] font-semibold text-gray-400">
                Unit {n} — Coming Soon
              </h3>
              <span className="text-[11px] text-gray-300">
                {n <= 6 ? "A2" : "B1"}
              </span>
            </div>
          </div>
        ))}
      </div>

      <BottomTabs />
    </div>
  );
}
