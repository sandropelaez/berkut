import { describe, expect, it } from "vitest";
import { emptySnapshot, mergeSnapshots, sanitizeSnapshot, type ProgressSnapshot } from "./progressMerge";

function snap(over: Partial<ProgressSnapshot>): ProgressSnapshot {
  return { ...emptySnapshot(), ...over };
}

describe("mergeSnapshots", () => {
  it("unions completed lessons, keeping a perfect run and the latest completion", () => {
    const a = snap({
      progress: {
        "u1-l1": { lessonId: "u1-l1", completed: true, perfectRun: true, completedAt: 100 },
        "u1-l2": { lessonId: "u1-l2", completed: true, perfectRun: false, completedAt: 200 },
      },
    });
    const b = snap({
      progress: {
        "u1-l2": { lessonId: "u1-l2", completed: true, perfectRun: false, completedAt: 300 },
        "u2-l1": { lessonId: "u2-l1", completed: true, perfectRun: false },
      },
    });
    const m = mergeSnapshots(a, b);
    expect(Object.keys(m.progress).sort()).toEqual(["u1-l1", "u1-l2", "u2-l1"]);
    expect(m.progress["u1-l1"]!.perfectRun).toBe(true);
    expect(m.progress["u1-l2"]).toMatchObject({ completedAt: 300 });
  });

  it("keeps the most recently reviewed SRS card", () => {
    const card = { easeFactor: 2.5, interval: 1, repetitions: 1, nextReview: 0 };
    const a = snap({ srs: { v1: { vocabId: "v1", ...card, lastReview: 200 } } });
    const b = snap({ srs: { v1: { vocabId: "v1", ...card, repetitions: 4, lastReview: 100 } } });
    expect(mergeSnapshots(a, b).srs.v1!.lastReview).toBe(200);
    expect(mergeSnapshots(b, a).srs.v1!.lastReview).toBe(200);
  });

  it("unions badges, keeping the earliest award time", () => {
    const m = mergeSnapshots(
      snap({ badges: { first_lesson: 300 } }),
      snap({ badges: { first_lesson: 100, perfect_round: 200 } }),
    );
    expect(m.badges).toEqual({ first_lesson: 100, perfect_round: 200 });
  });

  it("takes the streak from whichever side was active most recently", () => {
    const older = snap({ streakCount: 9, lastActiveDate: "2026-10-18" });
    const newer = snap({ streakCount: 1, lastActiveDate: "2026-10-20" });
    expect(mergeSnapshots(older, newer)).toMatchObject({ streakCount: 1, lastActiveDate: "2026-10-20" });
    expect(mergeSnapshots(newer, older)).toMatchObject({ streakCount: 1, lastActiveDate: "2026-10-20" });
    expect(mergeSnapshots(snap({}), older)).toMatchObject({ streakCount: 9, lastActiveDate: "2026-10-18" });
    expect(
      mergeSnapshots(snap({ streakCount: 3, lastActiveDate: "2026-10-20" }), newer).streakCount,
    ).toBe(3);
  });

  it("keeps each mistake's latest change, so a cleared exercise stays cleared", () => {
    const listed = { exerciseId: "e1", lessonId: "l1", correctStreak: 2, wrongCount: 1, updatedAt: 100 };
    const cleared = { ...listed, correctStreak: 3, updatedAt: 200, clearedAt: 200 };
    const other = { ...listed, exerciseId: "e2", updatedAt: 50 };
    const a = snap({ mistakes: { e1: listed, e2: other } });
    const b = snap({ mistakes: { e1: cleared } });
    expect(mergeSnapshots(a, b).mistakes).toEqual({ e1: cleared, e2: other });
    expect(mergeSnapshots(b, a).mistakes).toEqual({ e1: cleared, e2: other });
  });

  it("merging with an empty snapshot is a no-op", () => {
    const s = snap({
      streakCount: 2,
      lastActiveDate: "2026-10-20",
      progress: { a: { lessonId: "a", completed: true, perfectRun: false } },
    });
    expect(mergeSnapshots(emptySnapshot(), s)).toEqual(s);
    expect(mergeSnapshots(s, emptySnapshot())).toEqual(s);
  });
});

describe("sanitizeSnapshot", () => {
  it("drops malformed input instead of storing it", () => {
    const s = sanitizeSnapshot({
      progress: { ok: { completed: true, score: 12 }, bad: "nope" },
      srs: { v1: { easeFactor: 2.5, nextReview: 1 }, v2: { easeFactor: "x" } },
      badges: { first_lesson: 5, junk: -1 },
      streakCount: -3,
      lastActiveDate: "yesterday",
      mistakes: {
        e1: { lessonId: "l1", correctStreak: 1.7, wrongCount: -2, updatedAt: 9 },
        e2: { lessonId: 3, updatedAt: 9 },
        e3: { lessonId: "l1" },
      },
    });
    expect(Object.keys(s.progress)).toEqual(["ok"]);
    expect(s.progress.ok).toEqual({ lessonId: "ok", completed: true, perfectRun: false, completedAt: undefined });
    expect(Object.keys(s.srs)).toEqual(["v1"]);
    expect(s.badges).toEqual({ first_lesson: 5 });
    expect(s).toMatchObject({ streakCount: 0, lastActiveDate: null });
    expect(s.mistakes).toEqual({
      e1: { exerciseId: "e1", lessonId: "l1", correctStreak: 1, wrongCount: 0, updatedAt: 9, clearedAt: undefined },
    });
  });

  it("treats null / non-objects as empty", () => {
    expect(sanitizeSnapshot(null)).toEqual(emptySnapshot());
    expect(sanitizeSnapshot([1, 2])).toEqual(emptySnapshot());
  });
});
