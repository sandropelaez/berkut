import { Link } from "react-router-dom";
import { useStore } from "@/store/useStore";
import type { BadgeId } from "@/core/types";
import { Icon } from "@/components/ui";

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
    <div className="mx-auto max-w-content px-6 py-6">
      <div className="card mb-8">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 flex-none rounded-full bg-berkut-turquoise-soft text-berkut-turquoise-ink flex items-center justify-center text-title-lg">
            {displayName.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-title-md">{displayName}</h1>
            <Link to="/settings" className="text-small font-semibold text-berkut-turquoise-ink hover:underline">
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

      <h2 className="text-title-sm mb-4">Badges</h2>
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
    <div className="rounded-tile bg-berkut-surface p-4">
      <div className="text-small text-berkut-ink-muted">{label}</div>
      <div className="text-title-md tabular-nums mt-1">{value}</div>
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
      <div className="text-label mt-3">{meta.name}</div>
      <div className="text-caption text-berkut-ink-muted mt-1">
        {meta.desc}
      </div>
    </div>
  );
}

// Each badge is a medallion: sun gold when earned (a reward), surface when not.
function BadgeMedal({ id, earned }: { id: BadgeId; earned: boolean }) {
  const glyph: Record<BadgeId, JSX.Element> = {
    first_lesson: <Icon name="flag" size={28} />,
    week_warrior: <Icon name="flame" size={28} />,
    polyglot_in_progress: <Icon name="trophy" size={28} />,
    perfect_round: <Icon name="star" size={28} />,
    script_switcher: <span className="text-title-sm">Аа</span>,
    voice_of_steppe: <Icon name="speaker" size={28} />,
    cultural_explorer: <Icon name="bulb" size={28} />,
  };
  return (
    <span
      className={`grid h-14 w-14 place-items-center rounded-full ${
        earned ? "bg-berkut-sun text-berkut-on-sun shadow-[0_0_0_5px_rgb(var(--bk-sun-soft))]" : "bg-berkut-surface text-berkut-ink-muted"
      }`}
    >
      {glyph[id] ?? <Icon name="bolt" size={28} />}
    </span>
  );
}
