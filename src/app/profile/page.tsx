"use client";

import Link from "next/link";
import { useStore } from "@/lib/store";
import { UNITS } from "@/data/units";
import { BADGE_DEFS } from "@/lib/scoring";
import BottomTabs from "@/components/BottomTabs";

export default function ProfilePage() {
  const store = useStore();
  const completedCount = Object.keys(store.completedLessons).length;
  const totalLessons = UNITS.reduce((acc, u) => acc + u.lessons.length, 0);
  const pct = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  return (
    <div className="pb-24 min-h-screen">
      <header className="sticky top-0 z-30 bg-white border-b border-gray-100 px-5 py-3 flex items-center justify-between">
        <h1 className="text-[22px] font-extrabold text-berkut-sky font-display">Profile</h1>
        <Link href="/settings" className="text-xl hover:scale-110 transition-transform">
          ⚙️
        </Link>
      </header>

      <div className="px-5 py-6 space-y-5">
        {/* Avatar */}
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-berkut-sky to-berkut-gold flex items-center justify-center mx-auto mb-3 text-3xl text-white font-bold">
            {store.username.charAt(0).toUpperCase()}
          </div>
          <h2 className="text-xl font-bold text-berkut-dark">{store.username}</h2>
          <p className="text-gray-400 text-sm">{store.league} League</p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Total XP", value: store.xpTotal, icon: "⚡" },
            { label: "Streak", value: store.streakCount, icon: "🔥" },
            { label: "Gems", value: store.gems, icon: "💎" },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-2xl p-4 text-center shadow-sm">
              <div className="text-2xl mb-1">{s.icon}</div>
              <div className="text-[22px] font-bold text-berkut-dark">{s.value}</div>
              <div className="text-[12px] text-gray-400">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Progress */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <h3 className="font-semibold mb-3">Progress</h3>
          <div className="flex justify-between mb-2">
            <span className="text-gray-500 text-sm">
              {completedCount} / {totalLessons} lessons
            </span>
            <span className="font-semibold text-berkut-sky text-sm">{pct}%</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-berkut-sky rounded-full transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        {/* Badges */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <h3 className="font-semibold mb-3">Badges</h3>
          <div className="grid grid-cols-2 gap-3">
            {BADGE_DEFS.map((b) => {
              const earned = store.badges.includes(b.id);
              return (
                <div
                  key={b.id}
                  className={`p-3 rounded-xl text-center transition-all ${
                    earned
                      ? "bg-berkut-gold/10 border border-berkut-gold/30"
                      : "bg-gray-50 border border-gray-100 opacity-50"
                  }`}
                >
                  <div className="text-2xl mb-1">{b.icon}</div>
                  <div className={`text-[13px] font-semibold ${earned ? "text-berkut-dark" : "text-gray-400"}`}>
                    {b.name}
                  </div>
                  <div className="text-[11px] text-gray-400">{b.desc}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <BottomTabs />
    </div>
  );
}
