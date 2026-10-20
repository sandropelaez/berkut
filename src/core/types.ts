export type Script = "CYRILLIC" | "LATIN";

export type ExerciseType =
  | "MULTIPLE_CHOICE"
  | "TRANSLATE_EN_KK"
  | "TRANSLATE_KK_EN"
  | "LISTENING"
  | "MATCH_PAIRS"
  | "FILL_BLANK"
  | "TEACH";

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

// Ungraded explanation card shown between exercises. Text fields support
// **bold** spans (used to highlight suffixes); Kazakh text is transliterated
// with the learner's script preference like everywhere else.
export interface TeachPrompt {
  type: "TEACH";
  title: string;
  body?: string[];
  examples?: Array<{ kk: string; en: string }>;
  table?: { headers: string[]; rows: string[][] };
  tip?: string;
}

export type ExercisePrompt =
  | MultipleChoicePrompt
  | TranslateENKKPrompt
  | TranslateKKENPrompt
  | ListeningPrompt
  | MatchPairsPrompt
  | FillBlankPrompt
  | TeachPrompt;

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

export interface MistakeItem {
  exerciseId: string;
  lessonId: string;
  correctStreak: number; // correct first attempts since the last miss
  wrongCount: number;
  updatedAt: number;
  clearedAt?: number; // set once cleared; the entry stays as a tombstone
}

export interface UserProgress {
  lessonId: string;
  completed: boolean;
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
