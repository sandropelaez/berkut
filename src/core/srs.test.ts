import { describe, expect, it } from "vitest";
import { dueItems, newSrsItem, reviewSrs } from "./srs";

const DAY = 24 * 60 * 60 * 1000;

describe("newSrsItem", () => {
  it("starts with ease 2.5, interval 1, repetitions 0", () => {
    const now = Date.now();
    const item = newSrsItem("v-1", now);
    expect(item.easeFactor).toBe(2.5);
    expect(item.interval).toBe(1);
    expect(item.repetitions).toBe(0);
    expect(item.nextReview).toBe(now + DAY);
  });
});

describe("reviewSrs — correct answer path", () => {
  it("first correct: interval=1, reps=1", () => {
    const now = 0;
    const item = newSrsItem("v-1", now);
    const next = reviewSrs(item, true, now);
    expect(next.repetitions).toBe(1);
    expect(next.interval).toBe(1);
    expect(next.easeFactor).toBe(2.5);
  });

  it("second correct: interval=3", () => {
    const now = 0;
    let item = newSrsItem("v-1", now);
    item = reviewSrs(item, true, now);
    const next = reviewSrs(item, true, now);
    expect(next.repetitions).toBe(2);
    expect(next.interval).toBe(3);
  });

  it("third correct: interval = prev × ease", () => {
    let item = newSrsItem("v-1", 0);
    item = reviewSrs(item, true, 0);
    item = reviewSrs(item, true, 0); // now interval=3, reps=2
    const next = reviewSrs(item, true, 0);
    expect(next.interval).toBe(Math.round(3 * 2.5)); // 8
  });

  it("interval is clamped to 180 days max", () => {
    let item = newSrsItem("v-1", 0);
    for (let i = 0; i < 30; i++) item = reviewSrs(item, true, 0);
    expect(item.interval).toBeLessThanOrEqual(180);
  });
});

describe("reviewSrs — wrong answer path", () => {
  it("resets interval to 1 and reps to 0 on wrong", () => {
    let item = newSrsItem("v-1", 0);
    item = reviewSrs(item, true, 0);
    item = reviewSrs(item, true, 0);
    item = reviewSrs(item, true, 0); // interval > 1, reps = 3
    const wrong = reviewSrs(item, false, 0);
    expect(wrong.interval).toBe(1);
    expect(wrong.repetitions).toBe(0);
  });

  it("drops ease by 0.2 on wrong", () => {
    const item = newSrsItem("v-1", 0);
    const wrong = reviewSrs(item, false, 0);
    expect(wrong.easeFactor).toBeCloseTo(2.3, 5);
  });

  it("ease never drops below 1.3", () => {
    let item = newSrsItem("v-1", 0);
    for (let i = 0; i < 20; i++) item = reviewSrs(item, false, 0);
    expect(item.easeFactor).toBe(1.3);
  });
});

describe("dueItems", () => {
  it("returns items where nextReview <= now, sorted ascending", () => {
    const now = 1_000_000;
    const items = [
      { ...newSrsItem("a", now - 10 * DAY), nextReview: now - 1 },
      { ...newSrsItem("b", now), nextReview: now + DAY },
      { ...newSrsItem("c", now), nextReview: now - 100 },
    ];
    const due = dueItems(items, now);
    expect(due.map((i) => i.vocabId)).toEqual(["c", "a"]);
  });
});
