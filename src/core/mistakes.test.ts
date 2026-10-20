import { describe, expect, it } from "vitest";
import { activeMistakes, clear, CLEAR_AFTER, pickSession, recordAttempt } from "./mistakes";

describe("recordAttempt", () => {
  it("lists an exercise on a miss", () => {
    const m = recordAttempt({}, "e1", "l1", false, 10);
    expect(m.e1).toEqual({ exerciseId: "e1", lessonId: "l1", correctStreak: 0, wrongCount: 1, updatedAt: 10 });
  });

  it("ignores correct answers to exercises that aren't listed", () => {
    const empty = {};
    expect(recordAttempt(empty, "e1", "l1", true)).toBe(empty);
  });

  it(`clears after ${CLEAR_AFTER} correct answers in a row`, () => {
    let m = recordAttempt({}, "e1", "l1", false, 1);
    m = recordAttempt(m, "e1", "l1", true, 2);
    m = recordAttempt(m, "e1", "l1", true, 3);
    expect(activeMistakes(m)).toHaveLength(1);
    m = recordAttempt(m, "e1", "l1", true, 4);
    expect(activeMistakes(m)).toHaveLength(0);
    expect(m.e1).toMatchObject({ correctStreak: 3, clearedAt: 4, updatedAt: 4 });
  });

  it("resets the streak on a miss in between", () => {
    let m = recordAttempt({}, "e1", "l1", false, 1);
    m = recordAttempt(m, "e1", "l1", true, 2);
    m = recordAttempt(m, "e1", "l1", true, 3);
    m = recordAttempt(m, "e1", "l1", false, 4);
    expect(m.e1).toMatchObject({ correctStreak: 0, wrongCount: 2 });
    m = recordAttempt(m, "e1", "l1", true, 5);
    expect(activeMistakes(m)).toHaveLength(1);
  });

  it("relists a cleared exercise on a new miss", () => {
    let m = recordAttempt({}, "e1", "l1", false, 1);
    for (let t = 2; t < 2 + CLEAR_AFTER; t++) m = recordAttempt(m, "e1", "l1", true, t);
    expect(recordAttempt(m, "e1", "l1", true, 9)).toBe(m);
    m = recordAttempt(m, "e1", "l1", false, 10);
    expect(m.e1).toEqual({ exerciseId: "e1", lessonId: "l1", correctStreak: 0, wrongCount: 2, updatedAt: 10 });
  });
});

describe("clear", () => {
  it("tombstones listed exercises and skips unknown ones", () => {
    const m = clear(recordAttempt({}, "e1", "l1", false, 1), ["e1", "nope"], 5);
    expect(m.e1).toMatchObject({ clearedAt: 5, updatedAt: 5 });
    expect(m.nope).toBeUndefined();
  });
});

describe("pickSession", () => {
  const many = Array.from({ length: 15 }, (_, i) => `e${i}`).reduce(
    (m, id) => recordAttempt(m, id, "l1", false, 1),
    {} as ReturnType<typeof recordAttempt>,
  );

  it("picks at most the session size, without repeats", () => {
    const ids = pickSession(many, 10);
    expect(ids).toHaveLength(10);
    expect(new Set(ids).size).toBe(10);
  });

  it("only picks listed exercises", () => {
    const m = clear(many, ["e0", "e1", "e2"]);
    expect(pickSession(m, 50).sort()).toEqual(activeMistakes(m).map((x) => x.exerciseId).sort());
    expect(pickSession(m, 50)).not.toContain("e0");
  });

  it("shuffles", () => {
    let seed = 1;
    const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    const ids = pickSession(many, 15, rand);
    expect(ids).not.toEqual(Object.keys(many));
  });
});
