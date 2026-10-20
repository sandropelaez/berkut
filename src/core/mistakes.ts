// Repeat list: graded exercises the learner got wrong (docs/repetition.md).
// A miss lists an exercise (or resets its streak); CLEAR_AFTER correct first
// attempts in a row clear it. Cleared entries stay as tombstones so a sync
// merge with an older copy can't relist them.

import type { MistakeItem } from "./types";

export const CLEAR_AFTER = 3;
export const SESSION_SIZE = 10;

export function isActive(m: MistakeItem): boolean {
  return m.clearedAt === undefined;
}

// recordAttempt returns the updated map, or the same map when nothing changes.
export function recordAttempt(
  map: Record<string, MistakeItem>,
  exerciseId: string,
  lessonId: string,
  correct: boolean,
  now = Date.now(),
): Record<string, MistakeItem> {
  const prev = map[exerciseId];
  if (!correct) {
    return {
      ...map,
      [exerciseId]: {
        exerciseId,
        lessonId,
        correctStreak: 0,
        wrongCount: (prev?.wrongCount ?? 0) + 1,
        updatedAt: now,
      },
    };
  }
  if (!prev || !isActive(prev)) return map;
  const correctStreak = prev.correctStreak + 1;
  return {
    ...map,
    [exerciseId]: {
      ...prev,
      correctStreak,
      updatedAt: now,
      clearedAt: correctStreak >= CLEAR_AFTER ? now : undefined,
    },
  };
}

// clear marks exercises as cleared, e.g. ones removed from the course.
export function clear(
  map: Record<string, MistakeItem>,
  exerciseIds: string[],
  now = Date.now(),
): Record<string, MistakeItem> {
  const next = { ...map };
  for (const id of exerciseIds) {
    const m = next[id];
    if (m && isActive(m)) next[id] = { ...m, updatedAt: now, clearedAt: now };
  }
  return next;
}

export function activeMistakes(map: Record<string, MistakeItem>): MistakeItem[] {
  return Object.values(map).filter(isActive);
}

// pickSession returns up to `size` active exercise ids in random order.
export function pickSession(
  map: Record<string, MistakeItem>,
  size = SESSION_SIZE,
  random = Math.random,
): string[] {
  const ids = activeMistakes(map).map((m) => m.exerciseId);
  for (let i = ids.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [ids[i], ids[j]] = [ids[j]!, ids[i]!];
  }
  return ids.slice(0, size);
}
