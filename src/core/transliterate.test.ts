import { describe, expect, it } from "vitest";
import {
  cyrillicToLatin,
  latinToCyrillic,
  toScript,
  vowelHarmony,
} from "./transliterate";

describe("cyrillicToLatin", () => {
  it("transliterates basic greetings", () => {
    expect(cyrillicToLatin("сәлем")).toBe("sälem");
    expect(cyrillicToLatin("рақмет")).toBe("raqmet");
    expect(cyrillicToLatin("қош")).toBe("qoş");
  });

  it("handles uppercase", () => {
    expect(cyrillicToLatin("Сәлем")).toBe("Sälem");
  });

  it("maps the dotless-i for І", () => {
    // І → I (uppercase no-dot), і → ı (lowercase dotless)
    expect(cyrillicToLatin("Іс")).toBe("Is");
    expect(cyrillicToLatin("іс")).toBe("ıs");
  });

  it("leaves non-Cyrillic characters untouched", () => {
    expect(cyrillicToLatin("hello мир")).toBe("hello mir");
    expect(cyrillicToLatin("3 + 4 = 7")).toBe("3 + 4 = 7");
  });
});

describe("latinToCyrillic", () => {
  it("round-trips common words", () => {
    const round = (s: string) => latinToCyrillic(cyrillicToLatin(s));
    expect(round("сәлем")).toBe("сәлем");
    expect(round("рақмет")).toBe("рақмет");
    expect(round("қош")).toBe("қош");
  });

  it("handles digraphs", () => {
    expect(latinToCyrillic("Ch")).toBe("Ч");
    expect(latinToCyrillic("ch")).toBe("ч");
    expect(latinToCyrillic("Ts")).toBe("Ц");
  });
});

describe("toScript", () => {
  it("returns Cyrillic untouched when script=CYRILLIC", () => {
    expect(toScript("сәлем", "CYRILLIC")).toBe("сәлем");
  });

  it("transliterates to Latin when script=LATIN", () => {
    expect(toScript("сәлем", "LATIN")).toBe("sälem");
  });
});

describe("vowelHarmony", () => {
  it("classifies pure front-vowel words", () => {
    expect(vowelHarmony("үй")).toBe("front"); // ү
    expect(vowelHarmony("есім")).toBe("front"); // е, і
  });
  it("classifies pure back-vowel words", () => {
    expect(vowelHarmony("ана")).toBe("back");
    expect(vowelHarmony("қол")).toBe("back");
    expect(vowelHarmony("ботақан")).toBe("back");
  });
  it("flags mixed words", () => {
    // 'кітап' has і (front) + а (back) — a Russian/Persian loanword.
    expect(vowelHarmony("кітап")).toBe("mixed");
  });
});
