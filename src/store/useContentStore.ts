import { create } from "zustand";
import type { Exercise, ExerciseType, Lesson, Unit, Vocab } from "@/core/types";

interface RawUnit {
  id: string;
  language_code: string;
  order: number;
  title_native: string;
  title_en: string;
  cefr_level: "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
  emoji: string;
  description: string | null;
  cultural_note: string | null;
  status: string;
}
interface RawLesson {
  id: string;
  unit_id: string;
  order: number;
  title_native: string;
  title_en: string;
  status: string;
}
interface RawVocab {
  id: string;
  unit_id: string;
  native: string;
  english: string;
  audio_url: string | null;
  morphemes: string[] | null;
}
interface RawExercise {
  id: string;
  lesson_id: string;
  order: number;
  type: ExerciseType;
  prompt: any;
}

export interface CoursePayload {
  language: { code: string; name_en: string; name_native: string; flag_emoji: string };
  units: RawUnit[];
  lessons: RawLesson[];
  vocab: RawVocab[];
}

interface ContentState {
  status: "idle" | "loading" | "ready" | "error";
  error: string | null;
  units: Unit[];
  loadCourse: (lang?: string) => Promise<void>;
  loadLesson: (lessonId: string) => Promise<Lesson | null>;
}

function toUnit(raw: RawUnit, lessonsAll: RawLesson[], vocabAll: RawVocab[]): Unit {
  const lessons = lessonsAll
    .filter((l) => l.unit_id === raw.id)
    .sort((a, b) => a.order - b.order);
  const vocab = vocabAll.filter((v) => v.unit_id === raw.id);
  return {
    id: parseInt(raw.id.replace(/^u/, ""), 10) || 0,
    order: raw.order,
    titleKk: raw.title_native,
    titleEn: raw.title_en,
    cefrLevel: (raw.cefr_level as any) ?? "A1",
    emoji: raw.emoji,
    description: raw.description ?? undefined,
    culturalNote: raw.cultural_note ?? undefined,
    lessons: lessons.map((l) => ({
      id: l.id,
      unitId: parseInt(raw.id.replace(/^u/, ""), 10) || 0,
      order: l.order,
      titleKk: l.title_native,
      titleEn: l.title_en,
      vocab: vocab.map((v) => ({
        id: v.id,
        kazakh: v.native,
        english: v.english,
        audioUrl: v.audio_url ?? undefined,
        morphemes: v.morphemes ?? undefined,
      })) as Vocab[],
      exercises: [] as Exercise[], // hydrated by loadLesson
    })),
  };
}

export const useContentStore = create<ContentState>((set, get) => ({
  status: "idle",
  error: null,
  units: [],

  loadCourse: async (lang = "kk") => {
    if (get().status === "loading") return;
    set({ status: "loading", error: null });
    try {
      const res = await fetch(`/api/content?action=course&lang=${encodeURIComponent(lang)}`);
      const text = await res.text();
      if (!res.ok) {
        // Surface enough detail to debug: HTTP status + body, capped.
        const body = text.slice(0, 240);
        throw new Error(`HTTP ${res.status} — ${body}`);
      }
      let payload: CoursePayload;
      try {
        payload = JSON.parse(text) as CoursePayload;
      } catch {
        // Most common cause: SPA HTML returned instead of JSON
        // (vercel.json rewrite swallowing /api/*).
        throw new Error(
          "API returned HTML instead of JSON — likely a routing/rewrite issue. " +
            "Check vercel.json and ensure /api/* isn't matched by the SPA rewrite.",
        );
      }
      if (!payload.units || payload.units.length === 0) {
        throw new Error(
          "API returned 0 units. Did you run supabase/migrations/003_seed_content.sql?",
        );
      }
      const units = payload.units.map((u) => toUnit(u, payload.lessons, payload.vocab));
      set({ status: "ready", units });
    } catch (e: any) {
      set({ status: "error", error: e?.message ?? "load_failed" });
    }
  },

  loadLesson: async (lessonId) => {
    const res = await fetch(`/api/content?action=lesson&id=${encodeURIComponent(lessonId)}`);
    if (!res.ok) return null;
    const data = (await res.json()) as {
      lesson: RawLesson;
      exercises: RawExercise[];
      vocab: RawVocab[];
    };
    const units = get().units;
    const targetUnitId = data.lesson.unit_id;
    const unitNum = parseInt(targetUnitId.replace(/^u/, ""), 10) || 0;
    const hydrated: Lesson = {
      id: data.lesson.id,
      unitId: unitNum,
      order: data.lesson.order,
      titleKk: data.lesson.title_native,
      titleEn: data.lesson.title_en,
      vocab: data.vocab.map((v) => ({
        id: v.id,
        kazakh: v.native,
        english: v.english,
        audioUrl: v.audio_url ?? undefined,
        morphemes: v.morphemes ?? undefined,
      })),
      exercises: data.exercises
        .sort((a, b) => a.order - b.order)
        .map((e) => ({ id: e.id, type: e.type, prompt: e.prompt })),
    };
    // Splice the hydrated lesson back into the store's units cache.
    set({
      units: units.map((u) =>
        u.id === unitNum
          ? {
              ...u,
              lessons: u.lessons.map((l) => (l.id === hydrated.id ? hydrated : l)),
            }
          : u,
      ),
    });
    return hydrated;
  },
}));
