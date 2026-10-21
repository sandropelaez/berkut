import { Link } from "react-router-dom";
import { useStore } from "@/store/useStore";
import type { BadgeId } from "@/core/types";
import { BoltIcon, FlameIcon, Ornament, SpeakerIcon, StarIcon, SunMark, TrophyIcon } from "@/components/ui";

const BADGE_META: Record<BadgeId, { name: string; desc: string }> = {
  first_lesson: { name: "Сәлем!", desc: "Complete your first lesson" },
  week_warrior: { name: "Week Warrior", desc: "7-day streak" },
  polyglot_in_progress: { name: "Polyglot in Progress", desc: "Complete Unit 3" },
  perfect_round: { name: "Perfect Round", desc: "Finish a lesson with 0 mistakes" },
  script_switcher: { name: "Script Switcher", desc: "Try both Cyrillic and Latin" },
  voice_of_steppe: { name: "Voice of the Steppe", desc: "Complete 10 speaking exercises" },
  cultural_explorer: { name: "Cultural Explorer", desc: "Read all cultural cards in a unit" },
};

export default function Profile() {
  const displayName = useStore((s) => s.displayName);
  const streak = useStore((s) => s.streakCount);
  const badges = useStore((s) => s.badges);
  const progress = useStore((s) => s.progress);

  const completedLessons = Object.values(progress).filter((p) => p.completed).length;
  const perfectLessons = Object.values(progress).filter((p) => p.perfectRun).length;
  const earned = (Object.keys(BADGE_META) as BadgeId[]).filter((b) => badges[b]);
  const locked = (Object.keys(BADGE_META) as BadgeId[]).filter((b) => !badges[b]);

  return (
    <div className="mx-auto max-w-content px-4 py-6">
      <div className="card mb-6">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 flex-none rounded-full bg-berkut-sky text-berkut-on-sky flex items-center justify-center font-display text-2xl font-semibold">
            {displayName.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-[22px] leading-7">{displayName}</h1>
            <Link to="/settings" className="text-sm font-semibold text-berkut-sky-ink hover:underline">
              Edit profile
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 mt-6">
          <Stat label="Streak" value={streak} />
          <Stat label="Lessons" value={completedLessons} />
          <Stat label="Perfect" value={perfectLessons} />
        </div>
      </div>

      <h2 className="text-[19px] leading-[26px] font-medium mb-3">Badges</h2>
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
    <div className="rounded-tile bg-berkut-sunk p-3">
      <div className="text-[11px] font-bold uppercase tracking-[0.12em] text-berkut-muted">
        {label}
      </div>
      <div className="font-display text-xl font-semibold tabular-nums mt-1">{value}</div>
    </div>
  );
}

function BadgeCard({ id, earned }: { id: BadgeId; earned: boolean }) {
  const meta = BADGE_META[id];
  return (
    <div
      className={`card flex flex-col items-center text-center ${earned ? "" : "opacity-45"}`}
    >
      <BadgeMedal id={id} earned={earned} />
      <div className="font-semibold mt-3">{meta.name}</div>
      <div className="text-xs text-berkut-muted dark:text-berkut-muted-dark mt-1">
        {meta.desc}
      </div>
    </div>
  );
}

// Each badge is a medallion: gold when earned, sunk when not.
function BadgeMedal({ id, earned }: { id: BadgeId; earned: boolean }) {
  const glyph: Record<BadgeId, JSX.Element> = {
    first_lesson: <SunMark size={30} className="!text-current" />,
    week_warrior: <FlameIcon className="h-7 w-7" />,
    polyglot_in_progress: <TrophyIcon className="h-7 w-7" />,
    perfect_round: <StarIcon className="h-7 w-7" />,
    script_switcher: <span className="font-display text-base font-semibold">Аа</span>,
    voice_of_steppe: <SpeakerIcon className="h-7 w-7" />,
    cultural_explorer: <Ornament id={`badge-${id}`} className="!h-4 w-9 !text-current" />,
  };
  return (
    <span
      className={`grid h-14 w-14 place-items-center rounded-full ${
        earned ? "bg-berkut-gold text-berkut-on-gold shadow-[0_0_0_5px_rgb(var(--bk-gold-soft))]" : "bg-berkut-sunk text-berkut-muted"
      }`}
    >
      {glyph[id] ?? <BoltIcon className="h-7 w-7" />}
    </span>
  );
}
