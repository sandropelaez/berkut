export interface SrsItem {
  vocabId: string;
  easeFactor: number;
  interval: number;
  repetitions: number;
  lastReview: number;
  nextReview: number;
}

export function createSrsItem(vocabId: string): SrsItem {
  return {
    vocabId,
    easeFactor: 2.5,
    interval: 1,
    repetitions: 0,
    lastReview: 0,
    nextReview: Date.now(),
  };
}

export function updateSrsItem(item: SrsItem, correct: boolean): SrsItem {
  const updated = { ...item };
  if (correct) {
    updated.repetitions += 1;
    updated.interval = Math.min(180, Math.round(updated.interval * updated.easeFactor));
    updated.easeFactor = Math.min(3.0, updated.easeFactor + 0.1);
  } else {
    updated.repetitions = 0;
    updated.interval = 1;
    updated.easeFactor = Math.max(1.3, updated.easeFactor - 0.2);
  }
  updated.lastReview = Date.now();
  updated.nextReview = Date.now() + updated.interval * 86400000;
  return updated;
}

export function isDue(item: SrsItem): boolean {
  return Date.now() >= item.nextReview;
}
