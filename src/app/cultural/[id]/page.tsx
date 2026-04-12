"use client";

import { useParams, useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { transliterate } from "@/lib/transliterate";
import { getUnit, UNITS } from "@/data/units";

export default function CulturalPage() {
  const params = useParams();
  const router = useRouter();
  const store = useStore();
  const unitId = Number(params.id);
  const unit = getUnit(unitId);

  if (!unit) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400">Unit not found</p>
      </div>
    );
  }

  const T = (text: string) => transliterate(text, store.scriptPref);

  const handleDone = () => {
    store.addCulturalNote(unit.id);
    if (store.culturalNotesRead.length + 1 >= UNITS.length) {
      store.awardBadge("cultural_explorer");
    }
    router.push("/");
  };

  return (
    <div className="min-h-screen pb-24">
      <header className="sticky top-0 z-30 bg-white border-b border-gray-100 px-5 py-3 flex items-center gap-3">
        <button
          onClick={() => router.push("/")}
          className="text-xl text-gray-400 hover:text-gray-600"
        >
          ←
        </button>
        <h2 className="text-lg font-semibold flex-1 text-center">Cultural Note</h2>
        <div className="w-7" />
      </header>

      <div className="px-5 py-6">
        <div className="rounded-2xl p-6 bg-gradient-to-br from-berkut-gold/10 to-berkut-sky/5 border border-berkut-gold/20">
          <div className="text-4xl mb-3">🏔️</div>
          <h3 className="text-xl font-bold text-berkut-dark mb-1">{T(unit.titleKk)}</h3>
          <p className="text-sm text-berkut-sky font-medium mb-4">{unit.titleEn}</p>
          <p className="text-[15px] text-gray-600 leading-relaxed">{unit.culturalNote}</p>
        </div>

        {/* Vocabulary preview */}
        {unit.lessons[0]?.vocab && (
          <div className="mt-6">
            <h4 className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wide">
              Key vocabulary
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {unit.lessons[0].vocab.slice(0, 4).map((v) => (
                <div
                  key={v.id}
                  className="bg-white rounded-xl p-3 border border-gray-100"
                >
                  <p className="font-semibold text-berkut-dark text-sm font-sans">
                    {T(v.kazakh)}
                  </p>
                  <p className="text-gray-400 text-[12px]">{v.english}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={handleDone}
          className="w-full mt-6 py-3.5 rounded-2xl bg-berkut-sky text-white font-bold text-base hover:bg-berkut-sky-dark active:scale-[0.98] transition-all"
        >
          Got it!
        </button>
      </div>
    </div>
  );
}
