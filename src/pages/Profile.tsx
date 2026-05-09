import { Link } from "react-router-dom";
import { useStore } from "@/store/useStore";
import type { BadgeId } from "@/core/types";

const BADGE_META: Record<BadgeId, { name: string; emoji: string; desc: string }> = {
  first_lesson: { name: "Сәлем!", emoji: "👋", desc: "Complete your first lesson" },
  week_warrior: { name: "Week Warrior", emoji: "🔥", desc: "7-day streak" },
  polyglot_in_progress: { name: "Polyglot in Progress", emoji: "🗺️", desc: "Complete Unit 3" },
  perfect_round: { name: "Perfect Round", emoji: "⭐", desc: "Finish a lesson with 0 mistakes" },
  script_switcher: { name: "Script Switcher", emoji: "↔️", desc: "Try both Cyrillic and Latin" },
  voice_of_steppe: { name: "Voice of the Steppe", emoji: "🎤", desc: "Complete 10 speaking exercises" },
  cultural_explorer: { name: "Cultural Explorer", emoji: "🏛️", desc: "Read all cultural cards in a unit" },
};

export default function Profile() {
  const displayName = useStore((s) => s.displayName);
  const xp = useStore((s) => s.xpTotal);
  const xpWeekly = useStore((s) => s.xpWeekly);
  const streak = useStore((s) => s.streakCount);
  const gems = useStore((s) => s.gems);
  const badges = useStore((s) => s.badges);
  const progress = useStore((s) => s.progress);

  const completedLessons = Object.values(progress).filter((p) => p.completed).length;
  const perfectLessons = Object.values(progress).filter((p) => p.perfectRun).length;
  const earned = (Object.keys(BADGE_META) as BadgeId[]).filter((b) => badges[b]);
  const locked = (Object.keys(BADGE_META) as BadgeId[]).filter((b) => !badges[b]);

  return (
    <div className="mx-auto max-w-3xl px-4 sm:pl-32 py-6">
      <div className="card mb-6">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-berkut-primary text-white flex items-center justify-center text-2xl font-extrabold">
            {displayName.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-extrabold">{displayName}</h1>
            <Link to="/settings" className="text-sm text-berkut-primary hover:underline">
              Edit profile
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
          <Stat label="Total XP" value={xp} />
          <Stat label="This week" value={xpWeekly} />
          <Stat label="Streak" value={`${streak}🔥`} />
          <Stat label="Gems" value={`${gems}💎`} />
          <Stat label="Lessons done" value={completedLessons} />
          <Stat label="Perfect" value={`${perfectLessons}★`} />
        </div>
      </div>

      <h2 className="text-xl font-bold mb-3">Badges</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {earned.map((id) => (
          <BadgeCard key={id} id={id} earned />
        ))}
        {locked.map((id) => (
          <BadgeCard key={id} id={id} earned={false} />
        ))}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl bg-berkut-bg dark:bg-berkut-bg-dark p-3 border border-berkut-border dark:border-berkut-border-dark">
      <div className="text-xs uppercase tracking-wide text-berkut-muted dark:text-berkut-muted-dark">
        {label}
      </div>
      <div className="text-xl font-extrabold mt-1">{value}</div>
    </div>
  );
}

function BadgeCard({ id, earned }: { id: BadgeId; earned: boolean }) {
  const meta = BADGE_META[id];
  return (
    <div
      className={`card text-center ${earned ? "" : "opacity-40 grayscale"}`}
    >
      <div className="text-4xl">{meta.emoji}</div>
      <div className="font-bold mt-2">{meta.name}</div>
      <div className="text-xs text-berkut-muted dark:text-berkut-muted-dark mt-1">
        {meta.desc}
      </div>
    </div>
  );
}
