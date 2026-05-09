export type Script = "CYRILLIC" | "LATIN";

export type League = "BRONZE" | "SILVER" | "GOLD" | "SAPPHIRE" | "DIAMOND";

export type ExerciseType =
  | "MULTIPLE_CHOICE"
  | "TRANSLATE_EN_KK"
  | "TRANSLATE_KK_EN"
  | "LISTENING"
  | "MATCH_PAIRS"
  | "FILL_BLANK";

export interface Vocab {
  id: string;
  kazakh: string;
  english: string;
  audioUrl?: string;
  morphemes?: string[];
  exampleKk?: string;
  exampleEn?: string;
}

export interface MultipleChoicePrompt {
  type: "MULTIPLE_CHOICE";
  promptKk?: string;
  promptEn?: string;
  questionEn?: string;
  options: string[];
  correctAns: string;
  scriptOptions?: "kk" | "en";
}

export interface TranslateENKKPrompt {
  type: "TRANSLATE_EN_KK";
  promptEn: string;
  tiles: string[];
  correctAns: string[];
}

export interface TranslateKKENPrompt {
  type: "TRANSLATE_KK_EN";
  promptKk: string;
  options: string[];
  correctAns: string;
}

export interface ListeningPrompt {
  type: "LISTENING";
  audioKk: string;
  options: string[];
  correctAns: string;
}

export interface MatchPairsPrompt {
  type: "MATCH_PAIRS";
  pairs: Array<{ kazakh: string; english: string }>;
}

export interface FillBlankPrompt {
  type: "FILL_BLANK";
  sentenceKkParts: [string, string];
  options: string[];
  correctAns: string;
  hintEn?: string;
}

export type ExercisePrompt =
  | MultipleChoicePrompt
  | TranslateENKKPrompt
  | TranslateKKENPrompt
  | ListeningPrompt
  | MatchPairsPrompt
  | FillBlankPrompt;

export interface Exercise {
  id: string;
  type: ExerciseType;
  prompt: ExercisePrompt;
}

export interface Lesson {
  id: string;
  unitId: number;
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
  cefrLevel: "A1" | "A2" | "B1";
  description?: string;
  culturalNote?: string;
  emoji: string;
  lessons: Lesson[];
}

export interface SrsItem {
  vocabId: string;
  easeFactor: number;
  interval: number;
  repetitions: number;
  nextReview: number;
  lastReview?: number;
}

export interface UserProgress {
  lessonId: string;
  completed: boolean;
  score: number;
  perfectRun: boolean;
  completedAt?: number;
}

export type BadgeId =
  | "first_lesson"
  | "week_warrior"
  | "polyglot_in_progress"
  | "perfect_round"
  | "script_switcher"
  | "voice_of_steppe"
  | "cultural_explorer";
