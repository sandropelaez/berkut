import { describe, expect, it } from "vitest";
import { ECHO_GAP, MAX_GRADED, MAX_REQUEUES, MISTAKE_GAP, buildSession, requeueMistake, type SessionItem } from "./session";
import type { Exercise, ExercisePrompt, Lesson } from "./types";

// Deterministic Math.random stand-in (mulberry32).
function seeded(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

let nextId = 0;
const ex = (prompt: ExercisePrompt): Exercise => ({ id: `ex-${nextId++}`, type: prompt.type, prompt });

const lesson: Lesson = {
  id: "u3-b2",
  unitId: 3,
  order: 2,
  titleKk: "Мен дәрігермін",
  titleEn: "I am a doctor",
  vocab: [
    { id: "v1", kazakh: "дәрігер", english: "doctor" },
    { id: "v2", kazakh: "мұғалім", english: "teacher" },
    { id: "v3", kazakh: "инженер", english: "engineer" },
    { id: "v4", kazakh: "оқушы", english: "student" },
    { id: "v5", kazakh: "бала", english: "child" },
    { id: "v6", kazakh: "әке", english: "father" },
  ],
  exercises: [
    ex({ type: "TEACH", title: "There's no word for “am”" }),
    ex({ type: "FILL_BLANK", sentenceKkParts: ["Мен дәрігер", "."], options: ["мін", "пін", "мын"], correctAns: "мін", hintEn: "I am a doctor." }),
    ex({ type: "FILL_BLANK", sentenceKkParts: ["Мен бала", "."], options: ["мын", "мін", "пын"], correctAns: "мын", hintEn: "I am a child." }),
    ex({ type: "TRANSLATE_KK_EN", promptKk: "Мен инженермін.", options: ["I am an engineer.", "He is an engineer.", "I am a teacher."], correctAns: "I am an engineer." }),
    ex({ type: "TRANSLATE_EN_KK", promptEn: "I am a teacher.", tiles: ["Мен", "мұғаліммін", "мұғалім", "сен"], correctAns: ["Мен", "мұғаліммін"] }),
    ex({ type: "LISTENING", audioKk: "дәрігермін", options: ["дәрігермін", "дәрігер"], correctAns: "дәрігермін" }),
    ex({ type: "MULTIPLE_CHOICE", questionEn: "This suffix marks…", promptKk: "-мын", options: ["I am", "you are", "my"], correctAns: "I am" }),
    ex({
      type: "MATCH_PAIRS",
      pairs: [
        { kazakh: "дәрігер", english: "doctor" },
        { kazakh: "мұғалім", english: "teacher" },
        { kazakh: "инженер", english: "engineer" },
        { kazakh: "оқушы", english: "student" },
      ],
    }),
  ],
};

const graded = (q: SessionItem[]) => q.filter((i) => i.exercise.type !== "TEACH");

describe("buildSession", () => {
  const runs = [1, 2, 3, 42, 99].map((s) => buildSession(lesson, seeded(s)));

  it("keeps every authored exercise except Listening, in order", () => {
    for (const q of runs) {
      const firsts = q.filter((i) => i.kind === "new").map((i) => i.exercise.id);
      const expected = lesson.exercises.filter((e) => e.type !== "LISTENING").map((e) => e.id);
      expect(firsts).toEqual(expected);
      expect(q.some((i) => i.exercise.type === "LISTENING")).toBe(false);
    }
  });

  it("repeats material: more graded items than authored, within the cap", () => {
    for (const q of runs) {
      expect(graded(q).length).toBeGreaterThan(6 * 2);
      expect(graded(q).length).toBeLessThanOrEqual(MAX_GRADED);
    }
  });

  it("echoes each exercise later, in a different format where one exists", () => {
    for (const q of runs) {
      for (const [pos, it] of q.entries()) {
        if (it.kind !== "echo") continue;
        const firstPos = q.findIndex((i) => i.kind === "new" && i.exercise.id === it.exercise.id);
        expect(firstPos).toBeLessThan(pos);
        const between = graded(q.slice(firstPos + 1, pos)).length;
        expect(between).toBeGreaterThanOrEqual(Math.min(ECHO_GAP, graded(q).length) - 1);
        const original = lesson.exercises.find((e) => e.id === it.exercise.id)!;
        if (original.type !== "MULTIPLE_CHOICE") expect(it.exercise.type).not.toBe(original.type);
      }
    }
  });

  it("turns fill-in drills into tile sentences with the wrong suffixes as decoys", () => {
    const tiles = runs
      .flat()
      .map((i) => i.exercise.prompt)
      .find((p) => p.type === "TRANSLATE_EN_KK" && p.promptEn === "I am a doctor.");
    expect(tiles).toMatchObject({ correctAns: ["Мен", "дәрігермін"] });
    expect(tiles!.type === "TRANSLATE_EN_KK" && tiles!.tiles).toEqual(expect.arrayContaining(["дәрігерпін"]));
  });

  it("ends with a mixed review opened by a match round", () => {
    for (const q of runs) {
      const review = q.filter((i) => i.kind === "review");
      expect(review[0]!.exercise.type).toBe("MATCH_PAIRS");
      expect(q.slice(-review.length)).toEqual(review);
    }
  });

  it("produces answerable exercises", () => {
    for (const q of runs) {
      expect(new Set(q.map((i) => i.key)).size).toBe(q.length);
      for (const { exercise } of q) {
        const p = exercise.prompt;
        expect(p.type).toBe(exercise.type);
        if ("options" in p) {
          expect(p.options).toContain(p.correctAns);
          expect(new Set(p.options).size).toBe(p.options.length);
          expect(p.options.length).toBeGreaterThanOrEqual(3);
        }
        if (p.type === "TRANSLATE_EN_KK") for (const t of p.correctAns) expect(p.tiles).toContain(t);
      }
    }
  });

  it("shuffles authored options so the answer isn't always first", () => {
    const firsts = runs.map(
      (q) => q.find((i) => i.kind === "new" && i.exercise.type === "TRANSLATE_KK_EN")!.exercise.prompt,
    );
    expect(firsts.some((p) => p.type === "TRANSLATE_KK_EN" && p.options[0] !== p.correctAns)).toBe(true);
  });
});

describe("requeueMistake", () => {
  const q = buildSession(lesson, seeded(7));
  const pos = q.findIndex((i) => i.exercise.type === "FILL_BLANK");

  it("re-asks the missed exercise a few slots later", () => {
    const next = requeueMistake(q, pos, seeded(1));
    expect(next.length).toBe(q.length + 1);
    const again = next[pos + 1 + MISTAKE_GAP]!;
    expect(again.kind).toBe("mistake");
    expect(again.exercise.id).toBe(q[pos]!.exercise.id);
    expect(again.key).not.toBe(q[pos]!.key);
  });

  it("appends at the end when the lesson is nearly over", () => {
    const next = requeueMistake(q, q.length - 1, seeded(1));
    expect(next[next.length - 1]!.kind).toBe("mistake");
  });

  it(`gives up after ${MAX_REQUEUES} requeues`, () => {
    let queue = q;
    let at = pos;
    for (let i = 0; i < MAX_REQUEUES; i++) {
      queue = requeueMistake(queue, at, seeded(i));
      at = at + 1 + MISTAKE_GAP;
    }
    expect(requeueMistake(queue, at)).toBe(queue);
  });

  it("never requeues teach cards", () => {
    expect(requeueMistake(q, 0)).toBe(q);
  });
});

describe("tile decoys", () => {
  it("never offers a word that makes another correct answer", () => {
    const greetings: Lesson = {
      ...lesson,
      vocab: [{ id: "v", kazakh: "сіз ше?", english: "and you? (polite)" }],
      exercises: [
        ex({ type: "TRANSLATE_KK_EN", promptKk: "Сен ше?", options: ["And you?", "Me too.", "Thank you."], correctAns: "And you?" }),
        ex({ type: "TRANSLATE_KK_EN", promptKk: "Мен де.", options: ["Me too.", "And you?", "Thank you."], correctAns: "Me too." }),
        ex({ type: "TRANSLATE_KK_EN", promptKk: "Рақмет.", options: ["Thank you.", "Me too.", "And you?"], correctAns: "Thank you." }),
      ],
    };
    let checked = 0;
    for (let s = 0; s < 20; s++) {
      for (const { exercise } of buildSession(greetings, seeded(s))) {
        const p = exercise.prompt;
        if (p.type === "TRANSLATE_EN_KK" && p.correctAns.join(" ") === "Сен ше") {
          expect(p.tiles.map((t) => t.toLowerCase())).not.toContain("сіз");
          checked++;
        }
      }
    }
    expect(checked).toBeGreaterThan(0);
  });
});
