// Authoring helpers for course content that is compiled to SQL migrations
// (see scripts/build-beginner-migration.ts). Not imported by the app.
//
// Suffix drills are generated from src/core/harmony.ts, so the correct answer
// always follows the same rules the teach cards explain.

import type { ExercisePrompt, ExerciseType, TeachPrompt } from "@/core/types";
import {
  finalClass,
  isSoft,
  locativeSuffix,
  personalSuffix,
  pluralSuffix,
  possessive,
  presentNegative,
  presentTense,
  questionParticle,
  verbStem,
  type Person,
  type Possessor,
} from "@/core/harmony";
import { toScript } from "@/core/transliterate";

export type Confidence = "high" | "medium" | "low";

export interface Item {
  prompt: ExercisePrompt;
  conf?: Confidence;
}

export interface ContentLesson {
  id: string;
  titleKk: string;
  titleEn: string;
  items: Item[];
}

export interface ContentUnit {
  id: string;
  order: number;
  titleKk: string;
  titleEn: string;
  cefr: "A1" | "A2";
  emoji: string;
  description: string;
  culturalNote: string;
  /** [id suffix, Kazakh, English] — ids are prefixed with `vb-<unit>-`. */
  vocab: Array<[string, string, string]>;
  lessons: ContentLesson[];
}

// ─── Plain exercise builders ─────────────────────────────────────────────

export function teach(title: string, rest: Omit<TeachPrompt, "type" | "title"> = {}): Item {
  return { prompt: { type: "TEACH", title, ...rest } };
}

/** Multiple choice. Options are English (they aren't transliterated). */
export function mc(questionEn: string, promptKk: string | undefined, correct: string, wrong: string[]): Item {
  return {
    prompt: {
      type: "MULTIPLE_CHOICE",
      ...(promptKk ? { promptKk } : {}),
      questionEn,
      options: [correct, ...wrong],
      correctAns: correct,
    },
  };
}

/** Multiple choice whose options are Kazakh (rendered in the learner's script). */
export function mcKk(questionEn: string, correct: string, wrong: string[]): Item {
  return {
    prompt: { type: "MULTIPLE_CHOICE", questionEn, options: [correct, ...wrong], correctAns: correct, scriptOptions: "kk" },
  };
}

/** Kazakh → English: pick the right translation. */
export function kk(promptKk: string, correct: string, wrong: string[]): Item {
  return { prompt: { type: "TRANSLATE_KK_EN", promptKk, options: [correct, ...wrong], correctAns: correct } };
}

/** English → Kazakh: build the sentence from tiles. `answer` is space-separated. */
export function en(promptEn: string, answer: string, distractors: string[]): Item {
  const words = answer.split(/\s+/).filter(Boolean);
  return { prompt: { type: "TRANSLATE_EN_KK", promptEn, tiles: [...words, ...distractors], correctAns: words } };
}

export function listen(audioKk: string, wrong: string[]): Item {
  return { prompt: { type: "LISTENING", audioKk, options: [audioKk, ...wrong], correctAns: audioKk } };
}

export function match(pairs: Array<[string, string]>): Item {
  return { prompt: { type: "MATCH_PAIRS", pairs: pairs.map(([kazakh, english]) => ({ kazakh, english })) } };
}

export function fill(before: string, after: string, correct: string, wrong: string[], hintEn?: string): Item {
  return {
    prompt: {
      type: "FILL_BLANK",
      sentenceKkParts: [before, after],
      options: [correct, ...wrong],
      correctAns: correct,
      ...(hintEn ? { hintEn } : {}),
    },
  };
}

// ─── Rule-driven drills ──────────────────────────────────────────────────

const FLIP: Record<string, string> = { ы: "і", і: "ы", а: "е", е: "а" };
/** Swap strong ↔ soft vowels in a suffix: -мын ↔ -мін, -лар ↔ -лер. */
export const flip = (suffix: string) => [...suffix].map((c) => FLIP[c] ?? c).join("");

function pickTwo(correct: string, candidates: string[]): string[] {
  const out: string[] = [];
  for (const c of candidates) {
    if (c && c !== correct && !out.includes(c)) out.push(c);
    if (out.length === 2) break;
  }
  if (out.length < 2) throw new Error(`not enough distractors for ${correct}: ${candidates.join(",")}`);
  return out;
}

const swapConsonant = (suffix: string, to: string) => to + suffix.slice(1);

/** "I am / you are …" — blank is the personal ending on `word`. */
export function amDrill(before: string, word: string, person: Person, hintEn: string): Item {
  const correct = personalSuffix(word, person);
  let candidates: string[];
  if (person === "мен" || person === "біз") {
    const first = correct[0]!;
    candidates = [
      flip(correct),
      swapConsonant(correct, first === "м" ? "п" : "м"),
      swapConsonant(correct, first === "б" ? "п" : "б"),
    ];
  } else {
    const other: Record<string, Person> = { сен: "сіз", сіз: "сен", сендер: "сіздер", сіздер: "сендер" };
    candidates = [flip(correct), personalSuffix(word, other[person] ?? "сен")];
  }
  return fill(`${before}${word}`, ".", correct, pickTwo(correct, candidates), hintEn);
}

/** Plural: blank is -лар/-лер/-дар/-дер/-тар/-тер. */
export function pluralDrill(word: string, hintEn: string): Item {
  const correct = pluralSuffix(word);
  const first = correct[0]!;
  const candidates = [flip(correct), swapConsonant(correct, first === "л" ? "д" : "л"), swapConsonant(correct, first === "т" ? "д" : "т")];
  return fill(word, "", correct, pickTwo(correct, candidates), hintEn);
}

/** Locative: blank is -да/-де/-та/-те. */
export function locDrill(before: string, word: string, after: string, hintEn: string): Item {
  const correct = locativeSuffix(word);
  const candidates = [flip(correct), swapConsonant(correct, correct[0] === "т" ? "д" : "т")];
  return fill(`${before}${word}`, after, correct, pickTwo(correct, candidates), hintEn);
}

const POSS_FORMS: Record<Possessor, [[string, string], [string, string]]> = {
  менің: [["м", "м"], ["ым", "ім"]],
  сенің: [["ң", "ң"], ["ың", "ің"]],
  сіздің: [["ңыз", "ңіз"], ["ыңыз", "іңіз"]],
  оның: [["сы", "сі"], ["ы", "і"]],
  біздің: [["мыз", "міз"], ["ымыз", "іміз"]],
};

/** Possessive: blank is the whole possessed word (shows the қ→ғ changes). */
export function possDrill(before: string, word: string, who: Possessor, after: string, hintEn: string): Item {
  const correct = possessive(word, who);
  // Voicing (қ→ғ) keeps the length, so the ending always starts at word.length.
  const stemPart = correct.slice(0, word.length);
  const ending = correct.slice(word.length);
  const otherWho: Possessor = who === "менің" ? "сенің" : "менің";
  // The ending for the *other* word shape (vowel-final vs consonant-final).
  const [afterVowel, afterConsonant] = POSS_FORMS[who];
  const wrongShape =
    word + (finalClass(word) === "vowel" ? afterConsonant : afterVowel)[isSoft(word) ? 1 : 0];
  const candidates = [stemPart + flip(ending), word + ending, wrongShape, possessive(word, otherWho)];
  return fill(before, after, correct, pickTwo(correct, candidates), hintEn);
}

/** Present tense: blank is the conjugated verb. */
export function verbDrill(before: string, verb: string, person: Person, after: string, hintEn: string): Item {
  const correct = presentTense(verb, person);
  const stem = verbStem(verb);
  const rest = correct.slice(stem.length);
  const link = rest[0]!;
  const ending = rest.slice(1);
  const wrongLink = link === "й" ? stem + ending : stem + (link === "а" ? "е" : "а") + ending;
  const otherPerson: Person = person === "мен" ? "ол" : "мен";
  const candidates = [stem + link + flip(ending), wrongLink, presentTense(verb, otherPerson)];
  return fill(before, after, correct, pickTwo(correct, candidates), hintEn);
}

/** Present negative: blank is the negated verb. */
export function negDrill(before: string, verb: string, person: Person, after: string, hintEn: string): Item {
  const correct = presentNegative(verb, person);
  const stem = verbStem(verb);
  const neg = correct.slice(stem.length, stem.length + 2);
  const tail = correct.slice(stem.length + 2);
  const candidates = ["м", "б", "п"].filter((c) => c !== neg[0]).map((c) => stem + c + neg[1] + tail);
  return fill(before, after, correct, pickTwo(correct, candidates), hintEn);
}

/** Yes/no question particle after `word`. */
export function qDrill(before: string, word: string, hintEn: string): Item {
  const correct = questionParticle(word);
  const candidates = [flip(correct), swapConsonant(correct, correct[0] === "м" ? "б" : "м")];
  return fill(`${before}${word} `, "?", correct, pickTwo(correct, candidates), hintEn);
}

/** Conjugation table row cells with the ending in bold: бар**амын**. */
export function conjCell(verb: string, person: Person): string {
  const form = presentTense(verb, person);
  const stem = verbStem(verb);
  return `${stem}**${form.slice(stem.length)}**`;
}

// ─── Compilation ─────────────────────────────────────────────────────────

export interface CompiledExercise {
  id: string;
  lessonId: string;
  order: number;
  type: ExerciseType;
  prompt: ExercisePrompt;
  confidence: Confidence;
}

function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Deterministic shuffle so the correct option isn't always first. */
function shuffled<T>(arr: T[], seed: string): T[] {
  const out = [...arr];
  let x = hash(seed) || 1;
  for (let i = out.length - 1; i > 0; i--) {
    x ^= x << 13;
    x ^= x >>> 17;
    x ^= x << 5;
    const j = (x >>> 0) % (i + 1);
    [out[i], out[j]] = [out[j]!, out[i]!];
  }
  return out;
}

export function compileLesson(lesson: ContentLesson): CompiledExercise[] {
  return lesson.items.map((item, i) => {
    const id = `${lesson.id}-e${i + 1}`;
    const p = item.prompt;
    const prompt: ExercisePrompt =
      "options" in p ? { ...p, options: shuffled(p.options, id) } : p;
    return { id, lessonId: lesson.id, order: i + 1, type: p.type, prompt, confidence: item.conf ?? "high" };
  });
}

/** Throws on structurally broken exercises; returns the number checked. */
export function validateUnits(units: ContentUnit[]): number {
  const errors: string[] = [];
  const lessonIds = new Set<string>();
  const vocabIds = new Set<string>();
  let n = 0;
  for (const u of units) {
    for (const [suffix] of u.vocab) {
      const id = `vb-${u.id}-${suffix}`;
      if (vocabIds.has(id)) errors.push(`duplicate vocab ${id}`);
      vocabIds.add(id);
    }
    for (const l of u.lessons) {
      if (lessonIds.has(l.id)) errors.push(`duplicate lesson ${l.id}`);
      lessonIds.add(l.id);
      if (!l.id.startsWith(`${u.id}-`)) errors.push(`lesson ${l.id} not prefixed with ${u.id}`);
      const graded = l.items.filter((it) => it.prompt.type !== "TEACH").length;
      if (graded < 8) errors.push(`${l.id} has only ${graded} graded exercises`);
      if (l.items[0]?.prompt.type !== "TEACH") errors.push(`${l.id} should open with a teach card`);
      for (const ex of compileLesson(l)) {
        n++;
        const p = ex.prompt;
        const where = ex.id;
        if ("options" in p) {
          const opts = (p as { options: string[] }).options;
          if (new Set(opts).size !== opts.length) errors.push(`${where}: duplicate options ${opts}`);
          // Kazakh options must stay distinct in Latin script too (ұ and у are both "u").
          const kazakhOpts =
            p.type === "LISTENING" || p.type === "FILL_BLANK" || (p.type === "MULTIPLE_CHOICE" && p.scriptOptions === "kk");
          if (kazakhOpts && new Set(opts.map((o) => toScript(o, "LATIN").toLowerCase())).size !== opts.length)
            errors.push(`${where}: options collide in Latin script ${opts}`);
          if (opts.length < 2) errors.push(`${where}: fewer than 2 options`);
          if (!opts.includes((p as { correctAns: string }).correctAns)) errors.push(`${where}: answer not in options`);
        }
        if (p.type === "TRANSLATE_EN_KK") {
          const pool = [...p.tiles];
          for (const w of p.correctAns) {
            const k = pool.indexOf(w);
            if (k < 0) errors.push(`${where}: tile "${w}" missing`);
            else pool.splice(k, 1);
          }
          if (pool.some((d) => p.correctAns.includes(d))) errors.push(`${where}: distractor duplicates an answer tile`);
          if (p.tiles.some((t) => /[.,!?]/.test(t))) errors.push(`${where}: punctuation in tiles`);
        }
        if (p.type === "MATCH_PAIRS") {
          const kks = p.pairs.map((x) => x.kazakh);
          const ens = p.pairs.map((x) => x.english);
          if (p.pairs.length < 3 || p.pairs.length > 6) errors.push(`${where}: 3–6 pairs expected`);
          if (new Set(kks).size !== kks.length || new Set(ens).size !== ens.length) errors.push(`${where}: duplicate pair side`);
        }
        if (p.type === "TEACH") {
          const t = p as TeachPrompt;
          if (!t.title) errors.push(`${where}: teach card without title`);
          const texts = [t.title, ...(t.body ?? []), t.tip ?? "", ...(t.examples ?? []).map((e) => e.kk), ...(t.table?.rows.flat() ?? [])];
          for (const s of texts) if ((s.split("**").length - 1) % 2 !== 0) errors.push(`${where}: unbalanced ** in "${s}"`);
          if (t.table && t.table.rows.some((r) => r.length !== t.table!.headers.length)) errors.push(`${where}: ragged table`);
        }
      }
    }
  }
  if (errors.length) throw new Error(`Content errors:\n  ${errors.join("\n  ")}`);
  return n;
}
