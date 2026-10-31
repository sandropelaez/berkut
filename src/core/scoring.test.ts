import { describe, expect, it } from "vitest";
import { answersMatch, arraysMatch, levenshtein, similarity, typedMatch } from "./scoring";

describe("answersMatch", () => {
  it("normalises case and whitespace", () => {
    expect(answersMatch("Hello", "hello")).toBe(true);
    expect(answersMatch("  HELLO  ", "hello")).toBe(true);
  });
  it("strips punctuation", () => {
    expect(answersMatch("hello!", "hello")).toBe(true);
    expect(answersMatch("hello, world", "hello world")).toBe(true);
  });
  it("returns false on real mismatches", () => {
    expect(answersMatch("hello", "world")).toBe(false);
  });
});

describe("arraysMatch", () => {
  it("compares joined tile sequences", () => {
    expect(arraysMatch(["мен", "келдім"], ["мен", "келдім"])).toBe(true);
    expect(arraysMatch(["мен", "келдім"], ["келдім", "мен"])).toBe(false);
  });
});

describe("levenshtein", () => {
  it("returns 0 for identical strings", () => {
    expect(levenshtein("hello", "hello")).toBe(0);
  });
  it("returns length when one string is empty", () => {
    expect(levenshtein("", "hello")).toBe(5);
    expect(levenshtein("hello", "")).toBe(5);
  });
  it("counts single-character edits", () => {
    expect(levenshtein("kitten", "sitting")).toBe(3);
  });
});

describe("similarity", () => {
  it("returns 1 for identical", () => {
    expect(similarity("hello", "hello")).toBe(1);
  });
  it("returns roughly the inverse of edit distance ratio", () => {
    const s = similarity("hello", "hallo");
    expect(s).toBeGreaterThan(0.7);
    expect(s).toBeLessThan(0.9);
  });
});

describe("typedMatch", () => {
  it("accepts the answer in either script, ignoring case and punctuation", () => {
    expect(typedMatch("Сәлем!", "сәлем")).toBe("exact");
    expect(typedMatch("sälem", "Сәлем!")).toBe("exact");
    expect(typedMatch("Ит", "ит")).toBe("exact");
  });
  it("calls Kazakh letters typed as plain look-alikes close", () => {
    expect(typedMatch("салем", "сәлем")).toBe("close");
    expect(typedMatch("кайырлы тан", "қайырлы таң")).toBe("close");
    expect(typedMatch("salem", "сәлем")).toBe("close");
    expect(typedMatch("мен де жаксымын", "Мен де жақсымын.")).toBe("close");
  });
  it("rejects other mistakes and empty input", () => {
    expect(typedMatch("сәлемм", "сәлем")).toBe("wrong");
    expect(typedMatch("дәрігерпін", "дәрігермін")).toBe("wrong");
    expect(typedMatch("  ", "сәлем")).toBe("wrong");
  });
});
