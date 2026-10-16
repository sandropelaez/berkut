// Compiles ContentUnits into an idempotent SQL migration (upserts only,
// plus archiving the lessons the new content replaces).
import { compileLesson, validateUnits, type ContentUnit } from "./builders";

const q = (s: string | null | undefined) => (s == null ? "null" : `'${s.replace(/'/g, "''")}'`);
const list = (xs: string[]) => xs.map(q).join(", ");

const EXERCISE_TYPES = [
  "MULTIPLE_CHOICE",
  "TRANSLATE_EN_KK",
  "TRANSLATE_KK_EN",
  "LISTENING",
  "SPEAKING",
  "MATCH_PAIRS",
  "FILL_BLANK",
  "TEACH",
];

// Legacy lessons in these units use orders 1–5 and are re-upserted (active,
// same order) whenever older migrations are re-applied. lessons has a unique
// (unit_id, "order"), so new lessons start above that range; the skill tree
// numbers lessons by position, not by this value.
const LESSON_ORDER_BASE = 10;

export function buildMigrationSql(units: ContentUnit[], header: string): string {
  validateUnits(units);
  const unitIds = units.map((u) => u.id);
  const lessons = units.flatMap((u) => u.lessons.map((l, i) => ({ ...l, unitId: u.id, order: LESSON_ORDER_BASE + i + 1 })));
  const lessonIds = lessons.map((l) => l.id);
  const exercises = lessons.flatMap(compileLesson);
  const out: string[] = [header.trimEnd(), ""];

  out.push(
    "-- ─── Allow ungraded TEACH (explanation) cards ───────────────────────────",
    "alter table public.exercises drop constraint if exists exercises_type_check;",
    `alter table public.exercises add constraint exercises_type_check check (type in (${list(EXERCISE_TYPES)}));`,
    "",
    "-- ─── Units ───────────────────────────────────────────────────────────────",
    'insert into public.units (id, language_code, "order", title_native, title_en, cefr_level, emoji, description, cultural_note, status) values',
    units
      .map(
        (u) =>
          `  (${q(u.id)}, 'kk', ${u.order}, ${q(u.titleKk)}, ${q(u.titleEn)}, ${q(u.cefr)}, ${q(u.emoji)}, ${q(u.description)}, ${q(u.culturalNote)}, 'active')`,
      )
      .join(",\n"),
    "on conflict (id) do update set",
    '  language_code=excluded.language_code, "order"=excluded."order",',
    "  title_native=excluded.title_native, title_en=excluded.title_en,",
    "  cefr_level=excluded.cefr_level, emoji=excluded.emoji,",
    "  description=excluded.description, cultural_note=excluded.cultural_note,",
    "  status=excluded.status;",
    "",
    "-- ─── Retire the lessons and vocab these units used to hold ──────────────",
    "-- Archived (not deleted) so exercise reports and SRS history keep their rows.",
    `update public.lessons set status = 'archived'`,
    `  where unit_id in (${list(unitIds)})`,
    `    and id not in (${list(lessonIds)});`,
    "-- Old vocab moves to a hidden archived unit instead of being deleted.",
    `insert into public.units (id, language_code, "order", title_native, title_en, cefr_level, emoji, description, status) values`,
    `  ('u-legacy-a1', 'kk', 900, 'Ескі сөздер', 'Legacy A1 vocab (archived)', 'A1', '🗄️', 'Vocabulary from the pre-v1.6 A1 lessons, kept for reference. Not shown to learners.', 'archived')`,
    `on conflict (id) do update set status = excluded.status;`,
    `update public.vocab set unit_id = 'u-legacy-a1' where unit_id in (${list(unitIds)}) and id not like 'vb-%';`,
    "",
    "-- ─── Lessons ─────────────────────────────────────────────────────────────",
    'insert into public.lessons (id, unit_id, "order", title_native, title_en, status) values',
    lessons
      .map((l) => `  (${q(l.id)}, ${q(l.unitId)}, ${l.order}, ${q(l.titleKk)}, ${q(l.titleEn)}, 'active')`)
      .join(",\n"),
    "on conflict (id) do update set",
    '  unit_id=excluded.unit_id, "order"=excluded."order",',
    "  title_native=excluded.title_native, title_en=excluded.title_en,",
    "  status=excluded.status;",
    "",
    "-- ─── Vocab ───────────────────────────────────────────────────────────────",
    "insert into public.vocab (id, unit_id, native, english) values",
    units
      .flatMap((u) => u.vocab.map(([id, kk, en]) => `  (${q(`vb-${u.id}-${id}`)}, ${q(u.id)}, ${q(kk)}, ${q(en)})`))
      .join(",\n"),
    "on conflict (id) do update set",
    "  unit_id=excluded.unit_id, native=excluded.native, english=excluded.english;",
    "",
    "-- ─── Exercises ───────────────────────────────────────────────────────────",
    "-- Drop exercises removed from the source since the last run, then upsert.",
    `delete from public.exercises`,
    `  where lesson_id in (${list(lessonIds)})`,
    `    and id not in (${list(exercises.map((e) => e.id))});`,
  );

  for (const l of lessonIds) {
    const rows = exercises.filter((e) => e.lessonId === l);
    out.push(
      "",
      `-- ${l}`,
      'insert into public.exercises (id, lesson_id, "order", type, prompt, status, confidence) values',
      rows
        .map((e) => `  (${q(e.id)}, ${q(e.lessonId)}, ${e.order}, ${q(e.type)}, ${q(JSON.stringify(e.prompt))}::jsonb, 'active', ${q(e.confidence)})`)
        .join(",\n"),
      "on conflict (id) do update set",
      '  lesson_id=excluded.lesson_id, "order"=excluded."order", type=excluded.type,',
      "  prompt=excluded.prompt, status=excluded.status, confidence=excluded.confidence;",
    );
  }
  return out.join("\n") + "\n";
}
