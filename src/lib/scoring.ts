export const XP_VALUES = {
  CORRECT_FIRST: 10,
  CORRECT_RETRY: 5,
  LESSON_BONUS: 20,
  UNIT_BONUS: 100,
  PERFECT_BONUS: 30,
  STREAK_BONUS: 15,
} as const;

export function calculateLessonXp(
  correctFirst: number,
  correctRetry: number,
  isPerfect: boolean
): number {
  return (
    correctFirst * XP_VALUES.CORRECT_FIRST +
    correctRetry * XP_VALUES.CORRECT_RETRY +
    XP_VALUES.LESSON_BONUS +
    (isPerfect ? XP_VALUES.PERFECT_BONUS : 0)
  );
}

export type League = "BRONZE" | "SILVER" | "GOLD" | "SAPPHIRE" | "DIAMOND";

export const LEAGUES: League[] = ["BRONZE", "SILVER", "GOLD", "SAPPHIRE", "DIAMOND"];

export interface Badge {
  id: string;
  name: string;
  desc: string;
  icon: string;
}

export const BADGE_DEFS: Badge[] = [
  { id: "first_lesson", name: "Сәлем!", desc: "Complete first lesson", icon: "🎓" },
  { id: "week_warrior", name: "Week Warrior", desc: "7-day streak", icon: "⚔️" },
  { id: "polyglot", name: "Polyglot in Progress", desc: "Complete Unit 3", icon: "🌍" },
  { id: "perfect_round", name: "Perfect Round", desc: "Finish a lesson with 0 mistakes", icon: "✨" },
  { id: "script_switcher", name: "Script Switcher", desc: "Complete a lesson in each script", icon: "🔄" },
  { id: "voice_steppe", name: "Voice of the Steppe", desc: "Complete 10 speaking exercises", icon: "🎤" },
  { id: "cultural_explorer", name: "Cultural Explorer", desc: "Read all cultural cards", icon: "🏔️" },
];
