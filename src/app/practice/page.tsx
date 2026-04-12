"use client";

import { useStore } from "@/lib/store";
import { transliterate } from "@/lib/transliterate";
import { UNITS } from "@/data/units";
import BottomTabs from "@/components/BottomTabs";

export default function PracticePage() {
  const store = useStore();
  const T = (text: string) => transliterate(text, store.scriptPref);

  const learnedVocabIds = Object.keys(store.completedLessons).length > 0
    ? UNITS.flatMap((u) =>
        u.lessons
          .filter((l) => store.completedLessons[l.id])
          .flatMap((l) => l.vocab.map((v) => v.id))
      )
    : [];

  const allVocab = UNITS.flatMap((u) => u.lessons.flatMap((l) => l.vocab));
  const dueItems = allVocab.filter((v) => learnedVocabIds.includes(v.id)).slice(0, 10);

  return (
    <div className="pb-24 min-h-screen">
      <header className="sticky top-0 z-30 bg-white border-b border-gray-100 px-5 py-3">
        <h1 className="text-[22px] font-extrabold text-berkut-sky font-display">Practice</h1>
      </header>

      <div className="px-5 py-6">
        {dueItems.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">📚</div>
            <h3 className="text-gray-500 font-medium text-lg">No items to review yet</h3>
            <p className="text-gray-400 text-sm mt-2">
              Complete some lessons first, then come back to practice!
            </p>
          </div>
        ) : (
          <div>
            <p className="text-gray-500 text-sm mb-4">{dueItems.length} items to review</p>
            <div className="space-y-3">
              {dueItems.map((v) => (
                <div
                  key={v.id}
                  className="bg-white rounded-2xl p-4 shadow-sm flex justify-between items-center"
                >
                  <div>
                    <p className="font-semibold text-[17px] text-berkut-dark font-sans">
                      {T(v.kazakh)}
                    </p>
                    <p className="text-gray-400 text-sm">{v.english}</p>
                  </div>
                  <span className="text-[13px] font-semibold text-berkut-success bg-berkut-success-light px-3 py-1 rounded-lg">
                    Review
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <BottomTabs />
    </div>
  );
}
