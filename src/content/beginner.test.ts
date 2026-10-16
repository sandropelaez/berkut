import { describe, expect, it } from "vitest";
import { beginnerUnits } from "./beginner";
import { compileLesson, validateUnits } from "./builders";

describe("beginner course content", () => {
  it("passes structural validation", () => {
    expect(validateUnits(beginnerUnits)).toBeGreaterThan(300);
  });

  it("shuffles options so the answer isn't always first", () => {
    const firsts = beginnerUnits
      .flatMap((u) => u.lessons.flatMap(compileLesson))
      .filter((e) => "options" in e.prompt)
      .map((e) => (e.prompt as { options: string[]; correctAns: string }))
      .map((p) => p.options[0] === p.correctAns);
    const ratio = firsts.filter(Boolean).length / firsts.length;
    expect(ratio).toBeLessThan(0.6);
  });
});

describe("generated migration", () => {
  it("is up to date with the content source (run `npm run content:build`)", async () => {
    const { readFileSync } = await import("node:fs");
    const { resolve } = await import("node:path");
    const { buildMigrationSql } = await import("./sql");
    const { BEGINNER_MIGRATION_HEADER, BEGINNER_MIGRATION_PATH } = await import("./beginner/migration");
    const onDisk = readFileSync(resolve(__dirname, "../..", BEGINNER_MIGRATION_PATH), "utf8");
    expect(onDisk).toBe(buildMigrationSql(beginnerUnits, BEGINNER_MIGRATION_HEADER));
  });
});
