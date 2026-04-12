"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UserState, CompletedLesson, LessonScore } from "./types";
import type { Script } from "./transliterate";
import type { League } from "./scoring";
import type { SrsItem } from "./srs";

interface BerkutStore extends UserState {
  // Actions
  setUsername: (name: string) => void;
  setScript: (script: Script) => void;
  setOnboarded: () => void;
  addXp: (amount: number) => void;
  addGems: (amount: number) => void;
  spendGems: (amount: number) => boolean;
  completeLesson: (lessonId: number, score: LessonScore) => void;
  awardBadge: (badgeId: string) => void;
  updateStreak: () => void;
  useStreakFreeze: () => boolean;
  addCulturalNote: (unitId: number) => void;
  updateSrsItem: (item: SrsItem) => void;
  resetWeeklyXp: () => void;
}

const DEFAULT_STATE: UserState = {
  username: "",
  xpTotal: 0,
  xpWeekly: 0,
  streakCount: 0,
  streakFreezes: 1,
  gems: 50,
  league: "BRONZE",
  scriptPref: "CYRILLIC",
  lastActiveDate: null,
  completedLessons: {},
  badges: [],
  srsItems: {},
  culturalNotesRead: [],
  hasOnboarded: false,
};

export const useStore = create<BerkutStore>()(
  persist(
    (set, get) => ({
      ...DEFAULT_STATE,

      setUsername: (name) => set({ username: name }),

      setScript: (script) => set({ scriptPref: script }),

      setOnboarded: () => set({ hasOnboarded: true }),

      addXp: (amount) =>
        set((s) => ({
          xpTotal: s.xpTotal + amount,
          xpWeekly: s.xpWeekly + amount,
        })),

      addGems: (amount) => set((s) => ({ gems: s.gems + amount })),

      spendGems: (amount) => {
        const state = get();
        if (state.gems >= amount) {
          set({ gems: state.gems - amount });
          return true;
        }
        return false;
      },

      completeLesson: (lessonId, score) => {
        const existing = get().completedLessons[lessonId];
        const entry: CompletedLesson = {
          score: Math.max(
            existing?.score ?? 0,
            score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0
          ),
          perfect: score.correct === score.total,
          completedAt: Date.now(),
        };
        set((s) => ({
          completedLessons: { ...s.completedLessons, [lessonId]: entry },
        }));
      },

      awardBadge: (badgeId) => {
        if (get().badges.includes(badgeId)) return;
        set((s) => ({ badges: [...s.badges, badgeId] }));
      },

      updateStreak: () => {
        const today = new Date().toDateString();
        const state = get();
        if (state.lastActiveDate === today) return;

        const yesterday = new Date(Date.now() - 86400000).toDateString();
        const newStreak =
          state.lastActiveDate === yesterday ? state.streakCount + 1 : 1;

        set({
          lastActiveDate: today,
          streakCount: newStreak,
        });
      },

      useStreakFreeze: () => {
        const state = get();
        if (state.streakFreezes > 0) {
          set({ streakFreezes: state.streakFreezes - 1 });
          return true;
        }
        return false;
      },

      addCulturalNote: (unitId) => {
        if (get().culturalNotesRead.includes(unitId)) return;
        set((s) => ({
          culturalNotesRead: [...s.culturalNotesRead, unitId],
        }));
      },

      updateSrsItem: (item) =>
        set((s) => ({
          srsItems: { ...s.srsItems, [item.vocabId]: item },
        })),

      resetWeeklyXp: () => set({ xpWeekly: 0 }),
    }),
    {
      name: "berkut-store",
      partialize: (state) => ({
        username: state.username,
        xpTotal: state.xpTotal,
        xpWeekly: state.xpWeekly,
        streakCount: state.streakCount,
        streakFreezes: state.streakFreezes,
        gems: state.gems,
        league: state.league,
        scriptPref: state.scriptPref,
        lastActiveDate: state.lastActiveDate,
        completedLessons: state.completedLessons,
        badges: state.badges,
        srsItems: state.srsItems,
        culturalNotesRead: state.culturalNotesRead,
        hasOnboarded: state.hasOnboarded,
      }),
    }
  )
);
