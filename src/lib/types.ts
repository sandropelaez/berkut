import type { Script } from "./transliterate";
import type { League, Badge } from "./scoring";
import type { SrsItem } from "./srs";

export type ExerciseType =
  | "MULTIPLE_CHOICE"
  | "TRANSLATE_EN_KK"
  | "TRANSLATE_KK_EN"
  | "FILL_BLANK"
  | "MATCH_PAIRS"
  | "LISTENING"
  | "SPEAKING";

export interface Vocab {
  id: string;
  kazakh: string;
  english: string;
  audioUrl?: string;
  example?: string;
  morphemes?: string;
}

export interface Exercise {
  id: string;
  type: ExerciseType;
  prompt: {
    text?: string;
    hint?: string;
    pairs?: [string, string][];
  };
  options?: string[];
  correctAns: string | null;
  tiles?: string[];
  audioUrl?: string;
}

export interface Lesson {
  id: number;
  order: number;
  titleKk: string;
  titleEn: string;
  vocab: Vocab[];
  exercises: Exercise[];
}

export interface Unit {
  id: number;
  order: number;
  titleKk: string;
  titleEn: string;
  cefrLevel: string;
  culturalNote: string;
  lessons: Lesson[];
}

export interface CompletedLesson {
  score: number;
  perfect: boolean;
  completedAt: number;
}

export interface UserState {
  username: string;
  xpTotal: number;
  xpWeekly: number;
  streakCount: number;
  streakFreezes: number;
  gems: number;
  league: League;
  scriptPref: Script;
  lastActiveDate: string | null;
  completedLessons: Record<number, CompletedLesson>;
  badges: string[];
  srsItems: Record<string, SrsItem>;
  culturalNotesRead: number[];
  hasOnboarded: boolean;
}

export interface LessonScore {
  correct: number;
  total: number;
  xpEarned: number;
  mistakes: number;
}
