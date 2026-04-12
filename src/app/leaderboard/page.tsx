"use client";

import { useMemo } from "react";
import { useStore } from "@/lib/store";
import BottomTabs from "@/components/BottomTabs";

const NAMES = [
  "Arman", "Aisha", "Daulet", "Madina", "Yerbol", "Togzhan", "Nursultan", "Dinara",
  "Askar", "Gulnaz", "Bekzat", "Zhanna", "Kairat", "Saltanat", "Timur", "Asel",
  "Rustem", "Kamila", "Talgat", "Saule", "Marat", "Aigul", "Serik", "Dana",
  "Nurlan", "Zarina", "Azamat", "Aliya", "Bakhyt", "Raushan",
];

export default function LeaderboardPage() {
  const store = useStore();

  const board = useMemo(() => {
    const entries = NAMES.map((n, i) => ({
      name: n,
      xp: Math.max(50, 500 - i * 15 + Math.floor(Math.random() * 30)),
      isUser: false,
    }));
    entries.push({ name: `${store.username} (You)`, xp: store.xpWeekly, isUser: true });
    return entries
      .sort((a, b) => b.xp - a.xp)
      .map((u, i) => ({ ...u, rank: i + 1 }));
  }, [store.username, store.xpWeekly]);

  return (
    <div className="pb-24 min-h-screen">
      <header className="sticky top-0 z-30 bg-white border-b border-gray-100 px-5 py-3 flex items-center justify-between">
        <h1 className="text-[22px] font-extrabold text-berkut-sky font-display">Leaderboard</h1>
        <span className="text-[13px] font-semibold text-berkut-gold bg-berkut-gold/10 px-3 py-1 rounded-lg">
          {store.league} League
        </span>
      </header>

      <div className="px-5 py-4 space-y-1">
        {board.slice(0, 15).map((u) => (
          <div
            key={u.rank}
            className={`flex items-center px-4 py-3 rounded-xl transition-all ${
              u.isUser
                ? "bg-berkut-sky/10 border-2 border-berkut-sky"
                : u.rank <= 3
                ? "bg-berkut-gold/5"
                : ""
            }`}
          >
            <span
              className={`w-7 text-[15px] font-bold ${
                u.rank === 1
                  ? "text-berkut-gold"
                  : u.rank === 2
                  ? "text-gray-400"
                  : u.rank === 3
                  ? "text-amber-700"
                  : "text-gray-400"
              }`}
            >
              {u.rank}
            </span>
            <span
              className={`flex-1 text-[15px] ${
                u.isUser ? "font-bold text-berkut-sky" : "font-medium text-berkut-dark"
              }`}
            >
              {u.name}
            </span>
            <span className="font-semibold text-berkut-sky text-sm">{u.xp} XP</span>
          </div>
        ))}
      </div>

      <BottomTabs />
    </div>
  );
}
