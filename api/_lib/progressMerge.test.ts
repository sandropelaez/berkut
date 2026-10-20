import { describe, expect, it } from "vitest";
import { emptySnapshot, mergeSnapshots, sanitizeSnapshot, type ProgressSnapshot } from "./progressMerge";

function snap(over: Partial<ProgressSnapshot>): ProgressSnapshot {
  return { ...emptySnapshot(), ...over };
}

describe("mergeSnapshots", () => {
  it("unions completed lessons and keeps the best result per lesson", () => {
    const a = snap({
      progress: {
        "u1-l1": { lessonId: "u1-l1", completed: true, score: 40, perfectRun: true, completedAt: 100 },
        "u1-l2": { lessonId: "u1-l2", completed: true, score: 30, perfectRun: false, completedAt: 200 },
      },
    });
    const b = snap({
      progress: {
        "u1-l2": { lessonId: "u1-l2", completed: true, score: 50, perfectRun: false, completedAt: 300 },
        "u2-l1": { lessonId: "u2-l1", completed: true, score: 10, perfectRun: false },
      },
    });
    const m = mergeSnapshots(a, b);
    expect(Object.keys(m.progress).sort()).toEqual(["u1-l1", "u1-l2", "u2-l1"]);
    expect(m.progress["u1-l1"]!.perfectRun).toBe(true);
    expect(m.progress["u1-l2"]).toMatchObject({ score: 50, completedAt: 300 });
  });

  it("never lowers counters, so a stale device can't roll progress back", () => {
    const server = snap({ xpTotal: 500, xpWeekly: 120, gems: 25 });
    const staleDevice = snap({ xpTotal: 80, xpWeekly: 80, gems: 5 });
    expect(mergeSnapshots(server, staleDevice)).toMatchObject({ xpTotal: 500, xpWeekly: 120, gems: 25 });
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

  it("merging with an empty snapshot is a no-op", () => {
    const s = snap({
      xpTotal: 10,
      streakCount: 2,
      lastActiveDate: "2026-10-20",
      progress: { a: { lessonId: "a", completed: true, score: 5, perfectRun: false } },
    });
    expect(mergeSnapshots(emptySnapshot(), s)).toEqual(s);
    expect(mergeSnapshots(s, emptySnapshot())).toEqual(s);
  });
});

describe("sanitizeSnapshot", () => {
  it("drops malformed input instead of storing it", () => {
    const s = sanitizeSnapshot({
      progress: { ok: { completed: true, score: 12.7 }, bad: "nope" },
      srs: { v1: { easeFactor: 2.5, nextReview: 1 }, v2: { easeFactor: "x" } },
      badges: { first_lesson: 5, junk: -1 },
      xpTotal: -50,
      gems: "lots",
      lastActiveDate: "yesterday",
    });
    expect(Object.keys(s.progress)).toEqual(["ok"]);
    expect(s.progress.ok).toMatchObject({ lessonId: "ok", completed: true, score: 12, perfectRun: false });
    expect(Object.keys(s.srs)).toEqual(["v1"]);
    expect(s.badges).toEqual({ first_lesson: 5 });
    expect(s).toMatchObject({ xpTotal: 0, gems: 0, lastActiveDate: null });
  });

  it("treats null / non-objects as empty", () => {
    expect(sanitizeSnapshot(null)).toEqual(emptySnapshot());
    expect(sanitizeSnapshot([1, 2])).toEqual(emptySnapshot());
  });
});
