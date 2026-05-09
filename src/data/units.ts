import type { Lesson, Unit, Vocab } from "@/core/types";
import { unit1 } from "./unit1";
import { unit2 } from "./unit2";
import { unit3 } from "./unit3";

const stub = (
  id: number,
  titleKk: string,
  titleEn: string,
  emoji: string,
  cefrLevel: "A1" | "A2" | "B1" = "A2",
): Unit => ({
  id,
  order: id,
  titleKk,
  titleEn,
  cefrLevel,
  emoji,
  description: "Coming soon",
  lessons: [],
});

export const units: Unit[] = [
  unit1,
  unit2,
  unit3,
  stub(4, "Күнделікті өмір", "Daily Life", "☀️"),
  stub(5, "Қала мен көлік", "City & Transport", "🏙️"),
  stub(6, "Нарық пен дүкен", "Shopping & Market", "🛒"),
  stub(7, "Денсаулық", "Health", "🩺", "B1"),
  stub(8, "Саяхат", "Travel across Kazakhstan", "🏔️", "B1"),
  stub(9, "Жұмыс пен оқу", "Work & Study", "💼", "B1"),
  stub(10, "Мерекелер мен дәстүрлер", "Holidays & Traditions", "🎉", "B1"),
];

export function findUnit(id: number): Unit | undefined {
  return units.find((u) => u.id === id);
}

export function findLesson(id: string): { unit: Unit; lesson: Lesson } | undefined {
  for (const u of units) {
    const l = u.lessons.find((x) => x.id === id);
    if (l) return { unit: u, lesson: l };
  }
  return undefined;
}

export function allVocab(): Vocab[] {
  const out: Vocab[] = [];
  const seen = new Set<string>();
  for (const u of units) {
    for (const l of u.lessons) {
      for (const v of l.vocab) {
        if (!seen.has(v.id)) {
          seen.add(v.id);
          out.push(v);
        }
      }
    }
  }
  return out;
}
