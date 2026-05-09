import { useEffect, useState } from "react";
import { useStore } from "@/store/useStore";

interface LeaderboardEntry {
  rank: number;
  display_name: string;
  xp_weekly: number;
  league: string;
  is_self?: boolean;
}

const FALLBACK: LeaderboardEntry[] = [
  { rank: 1, display_name: "Алия", xp_weekly: 1240, league: "GOLD" },
  { rank: 2, display_name: "Daniyar", xp_weekly: 980, league: "GOLD" },
  { rank: 3, display_name: "Айгүл", xp_weekly: 760, league: "GOLD" },
  { rank: 4, display_name: "You", xp_weekly: 0, league: "BRONZE", is_self: true },
  { rank: 5, display_name: "Nurlan", xp_weekly: 480, league: "GOLD" },
  { rank: 6, display_name: "Asem", xp_weekly: 320, league: "GOLD" },
];

export default function Leaderboard() {
  const xpWeekly = useStore((s) => s.xpWeekly);
  const displayName = useStore((s) => s.displayName);
  const [rows, setRows] = useState<LeaderboardEntry[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/leaderboard")
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((data: LeaderboardEntry[]) => {
        if (!cancelled) setRows(data);
      })
      .catch(() => {
        const merged = FALLBACK.map((r) =>
          r.is_self ? { ...r, display_name: displayName, xp_weekly: xpWeekly } : r,
        ).sort((a, b) => b.xp_weekly - a.xp_weekly).map((r, i) => ({ ...r, rank: i + 1 }));
        if (!cancelled) setRows(merged);
      });
    return () => {
      cancelled = true;
    };
  }, [xpWeekly, displayName]);

  return (
    <div className="mx-auto max-w-2xl px-4 sm:pl-32 py-6">
      <div className="card mb-4 text-center">
        <h1 className="text-2xl font-extrabold">Weekly Leaderboard</h1>
        <p className="text-berkut-muted dark:text-berkut-muted-dark text-sm mt-1">
          Bronze → Silver → Gold → Sapphire → Diamond
        </p>
      </div>

      <div className="card divide-y divide-berkut-border dark:divide-berkut-border-dark">
        {(rows ?? []).map((r) => (
          <div
            key={`${r.rank}-${r.display_name}`}
            className={`flex items-center gap-4 py-3 ${
              r.is_self ? "bg-berkut-primary/10 -mx-5 px-5 rounded-xl" : ""
            }`}
          >
            <div className="w-8 text-center font-bold">
              {r.rank === 1 ? "🥇" : r.rank === 2 ? "🥈" : r.rank === 3 ? "🥉" : r.rank}
            </div>
            <div className="flex-1">
              <div className="font-bold">{r.display_name}</div>
              <div className="text-xs text-berkut-muted dark:text-berkut-muted-dark">
                {r.league}
              </div>
            </div>
            <div className="font-extrabold">⚡ {r.xp_weekly}</div>
          </div>
        ))}
        {!rows && (
          <div className="py-6 text-center text-berkut-muted dark:text-berkut-muted-dark">
            Loading…
          </div>
        )}
      </div>

      <p className="text-xs text-berkut-muted dark:text-berkut-muted-dark mt-3 text-center">
        Top 10 promote · Bottom 5 demote each Sunday
      </p>
    </div>
  );
}
