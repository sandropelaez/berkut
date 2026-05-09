// Simplified SM-2 spaced repetition (§7.1).
// Each item has ease_factor (default 2.5), interval (days), repetitions count.
// Correct: interval = interval × ease_factor, repetitions++.
// Wrong:   interval = 1, repetitions = 0, ease_factor = max(1.3, ease_factor − 0.2).
// Bounds: interval clamped to [1, 180] days.

import type { SrsItem } from "./types";

const DAY_MS = 24 * 60 * 60 * 1000;
const MIN_INTERVAL = 1;
const MAX_INTERVAL = 180;
const MIN_EASE = 1.3;

export function newSrsItem(vocabId: string, now = Date.now()): SrsItem {
  return {
    vocabId,
    easeFactor: 2.5,
    interval: 1,
    repetitions: 0,
    nextReview: now + DAY_MS,
  };
}

export function reviewSrs(
  item: SrsItem,
  correct: boolean,
  now = Date.now(),
): SrsItem {
  if (correct) {
    const reps = item.repetitions + 1;
    const nextInterval =
      reps === 1 ? 1 : reps === 2 ? 3 : Math.round(item.interval * item.easeFactor);
    const interval = Math.min(MAX_INTERVAL, Math.max(MIN_INTERVAL, nextInterval));
    return {
      ...item,
      easeFactor: item.easeFactor,
      interval,
      repetitions: reps,
      lastReview: now,
      nextReview: now + interval * DAY_MS,
    };
  }
  const easeFactor = Math.max(MIN_EASE, item.easeFactor - 0.2);
  return {
    ...item,
    easeFactor,
    interval: 1,
    repetitions: 0,
    lastReview: now,
    nextReview: now + DAY_MS,
  };
}

export function dueItems(items: SrsItem[], now = Date.now()): SrsItem[] {
  return items
    .filter((it) => it.nextReview <= now)
    .sort((a, b) => a.nextReview - b.nextReview);
}
