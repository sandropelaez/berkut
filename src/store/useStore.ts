import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  BadgeId,
  Script,
  SrsItem,
  UserProgress,
} from "@/core/types";
import { newSrsItem, reviewSrs } from "@/core/srs";
import { XP } from "@/core/scoring";

const HEARTS_MAX = 3;
const HEART_REGEN_MS = 30 * 60 * 1000;

export interface UserState {
  hydrated: boolean;
  setHydrated: (v: boolean) => void;

  displayName: string;
  setDisplayName: (n: string) => void;

  scriptPref: Script;
  setScriptPref: (s: Script) => void;

  darkMode: boolean;
  setDarkMode: (v: boolean) => void;

  xpTotal: number;
  xpWeekly: number;
  gems: number;

  hearts: number;
  heartsLastRegen: number;
  spendHeart: () => void;
  refillHearts: () => void;
  ensureHeartRegen: () => void;

  streakCount: number;
  lastActiveDate: string | null;
  bumpStreak: () => boolean; // returns true if today is a new streak day

  progress: Record<string, UserProgress>;
  recordLesson: (
    lessonId: string,
    score: number,
    perfectRun: boolean,
  ) => { xpAwarded: number; firstCompletion: boolean };

  srs: Record<string, SrsItem>;
  ensureSrs: (vocabIds: string[]) => void;
  reviewVocab: (vocabId: string, correct: boolean) => void;

  badges: Record<BadgeId, number>;
  awardBadge: (badge: BadgeId) => boolean;

  scriptsUsed: Script[];
  noteScriptUsed: (s: Script) => void;
  speakingCompleted: number;
  noteSpeakingCompleted: () => void;
  reset: () => void;
}

function todayKey(d = new Date()): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function diffDays(a: string, b: string): number {
  return Math.round(
    (new Date(b).getTime() - new Date(a).getTime()) / (24 * 60 * 60 * 1000),
  );
}

export const useStore = create<UserState>()(
  persist(
    (set, get) => ({
      hydrated: false,
      setHydrated: (v) => set({ hydrated: v }),

      displayName: "Жолбарыс",
      setDisplayName: (n) => set({ displayName: n.trim().slice(0, 30) }),

      scriptPref: "CYRILLIC",
      setScriptPref: (s) => {
        set({ scriptPref: s });
        get().noteScriptUsed(s);
      },

      darkMode: false,
      setDarkMode: (v) => {
        set({ darkMode: v });
        if (typeof document !== "undefined") {
          document.documentElement.classList.toggle("dark", v);
        }
      },

      xpTotal: 0,
      xpWeekly: 0,
      gems: 0,

      hearts: HEARTS_MAX,
      heartsLastRegen: Date.now(),
      spendHeart: () =>
        set((s) => ({ hearts: Math.max(0, s.hearts - 1) })),
      refillHearts: () =>
        set({ hearts: HEARTS_MAX, heartsLastRegen: Date.now() }),
      ensureHeartRegen: () => {
        const s = get();
        if (s.hearts >= HEARTS_MAX) return;
        const elapsed = Date.now() - s.heartsLastRegen;
        const regen = Math.floor(elapsed / HEART_REGEN_MS);
        if (regen > 0) {
          const newHearts = Math.min(HEARTS_MAX, s.hearts + regen);
          set({
            hearts: newHearts,
            heartsLastRegen: s.heartsLastRegen + regen * HEART_REGEN_MS,
          });
        }
      },

      streakCount: 0,
      lastActiveDate: null,
      bumpStreak: () => {
        const today = todayKey();
        const last = get().lastActiveDate;
        if (last === today) return false;
        const newStreak =
          last && diffDays(last, today) === 1 ? get().streakCount + 1 : 1;
        set({
          streakCount: newStreak,
          lastActiveDate: today,
          xpTotal: get().xpTotal + XP.STREAK_DAY,
          xpWeekly: get().xpWeekly + XP.STREAK_DAY,
        });
        if (newStreak >= 7) get().awardBadge("week_warrior");
        return true;
      },

      progress: {},
      recordLesson: (lessonId, score, perfectRun) => {
        const prev = get().progress[lessonId];
        const firstCompletion = !prev?.completed;
        const lessonXp = XP.COMPLETE_LESSON + (perfectRun ? XP.PERFECT_LESSON : 0);
        const xpAwarded = score + (firstCompletion ? lessonXp : 0);
        set((s) => ({
          progress: {
            ...s.progress,
            [lessonId]: {
              lessonId,
              completed: true,
              score: Math.max(prev?.score ?? 0, score),
              perfectRun: prev?.perfectRun || perfectRun,
              completedAt: Date.now(),
            },
          },
          xpTotal: s.xpTotal + xpAwarded,
          xpWeekly: s.xpWeekly + xpAwarded,
          gems: s.gems + (firstCompletion ? 5 : 0),
        }));
        if (firstCompletion) get().awardBadge("first_lesson");
        if (perfectRun) get().awardBadge("perfect_round");
        return { xpAwarded, firstCompletion };
      },

      srs: {},
      ensureSrs: (vocabIds) => {
        const cur = get().srs;
        const additions: Record<string, SrsItem> = {};
        for (const id of vocabIds) {
          if (!cur[id]) additions[id] = newSrsItem(id);
        }
        if (Object.keys(additions).length) {
          set({ srs: { ...cur, ...additions } });
        }
      },
      reviewVocab: (vocabId, correct) => {
        const cur = get().srs;
        const item = cur[vocabId] ?? newSrsItem(vocabId);
        const next = reviewSrs(item, correct);
        set({ srs: { ...cur, [vocabId]: next } });
      },

      badges: {} as Record<BadgeId, number>,
      awardBadge: (badge) => {
        if (get().badges[badge]) return false;
        set((s) => ({ badges: { ...s.badges, [badge]: Date.now() } }));
        return true;
      },

      scriptsUsed: ["CYRILLIC"],
      noteScriptUsed: (s) => {
        const cur = get().scriptsUsed;
        if (cur.includes(s)) return;
        const next = [...cur, s] as Script[];
        set({ scriptsUsed: next });
        if (next.length >= 2) get().awardBadge("script_switcher");
      },

      speakingCompleted: 0,
      noteSpeakingCompleted: () => {
        const next = get().speakingCompleted + 1;
        set({ speakingCompleted: next });
        if (next >= 10) get().awardBadge("voice_of_steppe");
      },

      reset: () =>
        set({
          xpTotal: 0,
          xpWeekly: 0,
          gems: 0,
          hearts: HEARTS_MAX,
          heartsLastRegen: Date.now(),
          streakCount: 0,
          lastActiveDate: null,
          progress: {},
          srs: {},
          badges: {} as Record<BadgeId, number>,
          scriptsUsed: ["CYRILLIC"],
          speakingCompleted: 0,
        }),
    }),
    {
      name: "berkut-store",
      version: 1,
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
        if (typeof document !== "undefined" && state?.darkMode) {
          document.documentElement.classList.add("dark");
        }
      },
    },
  ),
);
