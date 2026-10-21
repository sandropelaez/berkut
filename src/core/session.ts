// Lesson sessions: turns a lesson's authored exercises into a Duolingo-style
// queue with spaced repetition inside the lesson.
//
//  - Every graded exercise gets an "echo" a few exercises later that tests the
//    same phrase in a different format (KK→EN becomes EN→KK tiles, etc.).
//  - The lesson ends with a mixed review: a match round over the phrases just
//    practised plus a few of them in yet another format.
//  - A missed exercise is re-asked a few exercises later (requeueMistake).
//
// Variants are built only from the lesson's own content, so nothing here needs
// new authoring. Listening exercises are skipped (retired: browser TTS reads
// Kazakh too poorly).

import type {
  Exercise,
  ExercisePrompt,
  FillBlankPrompt,
  Lesson,
  MatchPairsPrompt,
  MultipleChoicePrompt,
  TranslateENKKPrompt,
  TranslateKKENPrompt,
} from "@/core/types";
import { normalize } from "@/core/scoring";

export type SessionKind = "new" | "echo" | "review" | "mistake";

export interface SessionItem {
  /** Unique per queue slot; the exercise id repeats across echoes. */
  key: string;
  /** `id` is the authored exercise this was derived from (used for reports). */
  exercise: Exercise;
  kind: SessionKind;
  /** How many times this exercise has been re-asked after a mistake. */
  requeues?: number;
}

/** Graded exercises between an exercise and its echo. */
export const ECHO_GAP = 3;
/** Extra items (besides the match round) in the closing mixed review. */
export const REVIEW_ITEMS = 3;
/** A missed exercise comes back this many slots later (or at the end). */
export const MISTAKE_GAP = 3;
/** Upper bound on graded exercises in a session (before mistakes). */
export const MAX_GRADED = 22;
/** Stop re-asking the same exercise after this many requeues. */
export const MAX_REQUEUES = 2;

const MAX_TILE_WORDS = 7;
const MATCH_SIZE = 5;

type Rand = () => number;

interface Pair {
  kk: string;
  en: string;
}

function shuffle<T>(arr: T[], rand: Rand): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j]!, out[i]!];
  }
  return out;
}

const clean = (s: string) => s.replace(/\*\*/g, "").trim();
/** Compare English loosely: "How are you? (polite)" ≈ "How are you?". */
const looseEn = (s: string) => normalize(s.replace(/\([^)]*\)/g, ""));
const words = (s: string) => s.split(/\s+/).filter(Boolean);

/** Split a Kazakh sentence into tiles, dropping punctuation. */
function tokens(kk: string): string[] {
  return words(kk.replace(/[.,!?;:"«»“”()]/g, " "));
}

const isTileable = (kk: string) => {
  const t = tokens(kk);
  return t.length >= 2 && t.length <= MAX_TILE_WORDS && !kk.includes("—");
};

function commonPrefix(a: string, b: string): number {
  const x = a.toLowerCase();
  const y = b.toLowerCase();
  let i = 0;
  while (i < x.length && i < y.length && x[i] === y[i]) i++;
  return i;
}

const isMeaningQuestion = (p: MultipleChoicePrompt) =>
  !!p.promptKk && /what does (this|it) mean/i.test(p.questionEn ?? "");

/** The Kazakh ↔ English pair an exercise tests, if it tests one. */
function pairOf(prompt: ExercisePrompt): Pair | null {
  const pair = rawPairOf(prompt);
  // "Қайырлы таң! — Сәлем!" is two speakers, not one phrase to translate.
  return pair && !pair.kk.includes("—") ? pair : null;
}

function rawPairOf(prompt: ExercisePrompt): Pair | null {
  switch (prompt.type) {
    case "TRANSLATE_KK_EN":
      return { kk: prompt.promptKk, en: prompt.correctAns };
    case "TRANSLATE_EN_KK":
      return { kk: prompt.correctAns.join(" "), en: prompt.promptEn };
    case "MULTIPLE_CHOICE":
      return isMeaningQuestion(prompt) ? { kk: prompt.promptKk!, en: prompt.correctAns } : null;
    case "FILL_BLANK":
      if (!prompt.hintEn) return null;
      return {
        kk: prompt.sentenceKkParts[0] + prompt.correctAns + prompt.sentenceKkParts[1],
        en: prompt.hintEn,
      };
    default:
      return null;
  }
}

class Bank {
  /** Pairs tested by the lesson's exercises. */
  tested: Pair[] = [];
  /** Tested pairs plus the unit vocab: used for distractors only. */
  all: Pair[] = [];
  /** Kazakh spelled from a match round, so the review round can mix others in. */
  fromMatch = new Set<string>();
  /** Every Kazakh spelling seen, duplicates included (for punctuation). */
  private forms: string[] = [];

  constructor(lesson: Lesson, exercises: Exercise[]) {
    const seen = new Set<string>();
    const add = (p: Pair, tested: boolean) => {
      const pair = { kk: clean(p.kk), en: clean(p.en) };
      if (!pair.kk || !pair.en) return;
      this.forms.push(pair.kk);
      const id = normalize(pair.kk) + "|" + looseEn(pair.en);
      if (seen.has(id)) return;
      seen.add(id);
      this.all.push(pair);
      if (tested) this.tested.push(pair);
    };
    for (const ex of exercises) {
      const p = pairOf(ex.prompt);
      if (p) add(p, true);
      if (ex.prompt.type === "MATCH_PAIRS") {
        for (const mp of ex.prompt.pairs) {
          add({ kk: mp.kazakh, en: mp.english }, true);
          this.fromMatch.add(normalize(mp.kazakh));
        }
      }
    }
    for (const v of lesson.vocab) add({ kk: v.kazakh, en: v.english }, false);
  }

  /**
   * The punctuated form of a Kazakh phrase (tiles have none): the lesson's
   * own spelling if it has one, else the English sentence's final mark.
   */
  punctuated(pair: Pair): string {
    if (/[.?!]$/.test(pair.kk)) return pair.kk;
    const n = normalize(pair.kk);
    const head = pair.kk[0]!;
    const known = this.forms.find(
      (f) => normalize(f) === n && /[.?!]$/.test(f) && f[0]!.toLowerCase() === head.toLowerCase(),
    );
    // Keep the phrase's own capital: vocab is stored lower-case.
    if (known) return head + known.slice(1);
    const mark = pair.en.replace(/\s*\([^)]*\)$/, "").match(/[.?!]$/)?.[0] ?? "";
    return pair.kk + mark;
  }

  /** English options that are clearly not translations of `pair.kk`. */
  enDistractors(pair: Pair, n: number, rand: Rand): string[] {
    const target = looseEn(pair.en);
    const kk = normalize(pair.kk);
    const len = words(pair.en).length;
    const pool = this.all.filter((p) => normalize(p.kk) !== kk && looseEn(p.en) !== target);
    return pickClosest(
      pool.map((p) => p.en),
      (en) => Math.abs(words(en).length - len),
      looseEn,
      n,
      rand,
    );
  }

  /** Kazakh options that clearly don't mean `pair.en`. */
  kkDistractors(pair: Pair, n: number, rand: Rand): string[] {
    const target = looseEn(pair.en);
    const kk = normalize(pair.kk);
    const len = words(pair.kk).length;
    const pool = this.all.filter((p) => normalize(p.kk) !== kk && looseEn(p.en) !== target);
    return pickClosest(
      pool.map((p) => p.kk),
      (k) => Math.abs(words(k).length - len),
      normalize,
      n,
      rand,
    );
  }

  /**
   * Tile distractors: words from the lesson that look like the answer's —
   * but never one that swaps in to make another right answer ("Сіз ше" is
   * "And you?" too).
   */
  tileDistractors(pair: Pair, answer: string[], preferred: string[], n: number, rand: Rand): string[] {
    const target = looseEn(pair.en);
    const sameMeaning = new Set(this.all.filter((p) => looseEn(p.en) === target).map((p) => normalize(p.kk)));
    const makesAnswer = (t: string) =>
      answer.some((_, i) => sameMeaning.has(normalize(answer.map((w, j) => (j === i ? t : w)).join(" "))));
    const taken = new Set(answer.map(normalize));
    const out: string[] = [];
    const pool = this.all.flatMap((p) => tokens(p.kk));
    const ranked = shuffle(pool, rand).sort(
      (a, b) =>
        Math.max(...answer.map((w) => commonPrefix(w, b))) -
        Math.max(...answer.map((w) => commonPrefix(w, a))),
    );
    for (const t of [...preferred, ...ranked]) {
      if (out.length >= n) break;
      const k = normalize(t);
      if (taken.has(k) || makesAnswer(t)) continue;
      taken.add(k);
      out.push(t);
    }
    return out;
  }
}

/** Up to `n` distinct candidates, lowest `cost` first, ties broken randomly. */
function pickClosest(
  candidates: string[],
  cost: (s: string) => number,
  key: (s: string) => string,
  n: number,
  rand: Rand,
): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const c of shuffle(candidates, rand).sort((a, b) => cost(a) - cost(b))) {
    const k = key(c);
    if (!k || seen.has(k)) continue;
    seen.add(k);
    out.push(c);
    if (out.length === n) break;
  }
  return out;
}

// ─── Variant builders ────────────────────────────────────────────────────

function kkToEn(pair: Pair, bank: Bank, rand: Rand): TranslateKKENPrompt | null {
  const wrong = bank.enDistractors(pair, 3, rand);
  if (wrong.length < 2) return null;
  return {
    type: "TRANSLATE_KK_EN",
    promptKk: bank.punctuated(pair),
    options: shuffle([pair.en, ...wrong], rand),
    correctAns: pair.en,
  };
}

function enToKkChoice(pair: Pair, bank: Bank, rand: Rand): MultipleChoicePrompt | null {
  const wrong = bank.kkDistractors(pair, 3, rand);
  if (wrong.length < 2) return null;
  const kk = bank.punctuated(pair);
  return {
    type: "MULTIPLE_CHOICE",
    questionEn: `Choose the Kazakh for “${pair.en}”`,
    options: shuffle([kk, ...wrong], rand),
    correctAns: kk,
    scriptOptions: "kk",
  };
}

function enToKkTiles(pair: Pair, bank: Bank, rand: Rand, preferred: string[] = []): TranslateENKKPrompt | null {
  if (!isTileable(pair.kk)) return null;
  const answer = tokens(pair.kk);
  const extra = bank.tileDistractors(pair, answer, preferred, Math.min(4, Math.max(2, answer.length)), rand);
  if (extra.length < 2) return null;
  return { type: "TRANSLATE_EN_KK", promptEn: pair.en, tiles: [...answer, ...extra], correctAns: answer };
}

/** Same exercise with its options in a new order. */
function reshuffled(prompt: ExercisePrompt, rand: Rand): ExercisePrompt {
  switch (prompt.type) {
    case "MULTIPLE_CHOICE":
    case "TRANSLATE_KK_EN":
    case "FILL_BLANK":
      return { ...prompt, options: shuffle(prompt.options, rand) } as ExercisePrompt;
    case "MATCH_PAIRS":
      return { ...prompt, pairs: shuffle(prompt.pairs, rand) };
    default:
      return prompt;
  }
}

/**
 * Other ways to test what `prompt` tests, best first, never in its own format.
 * Each call may pick different distractors (and, for match rounds, pairs).
 */
function variantsOf(prompt: ExercisePrompt, bank: Bank, rand: Rand): ExercisePrompt[] {
  const out: Array<ExercisePrompt | null> = [];
  switch (prompt.type) {
    case "TRANSLATE_KK_EN":
    case "MULTIPLE_CHOICE": {
      const pair = pairOf(prompt);
      if (pair) out.push(enToKkTiles(pair, bank, rand), enToKkChoice(pair, bank, rand));
      break;
    }
    case "TRANSLATE_EN_KK": {
      const pair = pairOf(prompt);
      if (pair) out.push(kkToEn(pair, bank, rand), enToKkChoice(pair, bank, rand));
      break;
    }
    case "FILL_BLANK": {
      const pair = pairOf(prompt);
      if (pair) {
        // The wrong blanks, written into the sentence, make the best tiles:
        // "дәрігерпін" next to "дәрігермін".
        const [before, after] = prompt.sentenceKkParts;
        const answer = new Set(tokens(pair.kk).map(normalize));
        const near = prompt.options
          .filter((o) => o !== prompt.correctAns)
          .flatMap((o) => tokens(before + o + after))
          .filter((t) => !answer.has(normalize(t)));
        out.push(enToKkTiles(pair, bank, rand, near), kkToEn(pair, bank, rand));
      }
      break;
    }
    case "MATCH_PAIRS": {
      const [a, b] = shuffle(prompt.pairs, rand);
      if (a) out.push(kkToEn({ kk: a.kazakh, en: a.english }, bank, rand));
      if (b) out.push(enToKkChoice({ kk: b.kazakh, en: b.english }, bank, rand));
      break;
    }
  }
  const found = out.filter((p): p is ExercisePrompt => p !== null);
  // Nothing else fits (a grammar question, a dialogue line): ask it again.
  return found.length || prompt.type === "TEACH" ? found : [reshuffled(prompt, rand)];
}

function matchRound(bank: Bank, rand: Rand): MatchPairsPrompt | null {
  const short = bank.tested.filter((p) => words(p.kk).length <= 3 && words(p.en).length <= 4);
  const kks = new Set<string>();
  const ens = new Set<string>();
  const pairs: MatchPairsPrompt["pairs"] = [];
  // Short first: the match round is a quick-fire vocab check.
  // Words the lesson already matched count as one word longer, so the round
  // mixes in phrases from the other exercises instead of replaying that match.
  const cost = (p: Pair) => words(p.kk).length + (bank.fromMatch.has(normalize(p.kk)) ? 1 : 0);
  const ranked = shuffle(short, rand).sort((a, b) => cost(a) - cost(b));
  for (const p of ranked) {
    const kk = normalize(p.kk);
    const en = looseEn(p.en);
    if (kks.has(kk) || ens.has(en)) continue;
    kks.add(kk);
    ens.add(en);
    pairs.push({ kazakh: p.kk, english: p.en });
    if (pairs.length === MATCH_SIZE) break;
  }
  return pairs.length >= 4 ? { type: "MATCH_PAIRS", pairs } : null;
}

// ─── Session ─────────────────────────────────────────────────────────────

/** What a prompt asks, so a session doesn't ask the same thing the same way twice. */
function signature(prompt: ExercisePrompt): string | null {
  const kk =
    pairOf(prompt)?.kk ??
    (prompt.type === "MULTIPLE_CHOICE" && prompt.scriptOptions === "kk" ? prompt.correctAns : null);
  return kk === null ? null : `${prompt.type}|${normalize(kk)}`;
}

export function buildSession(lesson: Lesson, rand: Rand = Math.random): SessionItem[] {
  const authored = lesson.exercises.filter((e) => e.type !== "LISTENING");
  const bank = new Bank(lesson, authored);
  let n = 0;
  const item = (source: Exercise, prompt: ExercisePrompt, kind: SessionKind): SessionItem => ({
    key: `${source.id}#${n++}`,
    exercise: { id: source.id, type: prompt.type, prompt },
    kind,
  });

  const graded = authored.filter((e) => e.type !== "TEACH");
  const variants = new Map(graded.map((e) => [e, variantsOf(e.prompt, bank, rand)]));
  const match = matchRound(bank, rand);

  // Fit echoes and review into MAX_GRADED, keeping at least one review item.
  const withVariants = graded.filter((e) => variants.get(e)!.length > 0);
  const room = MAX_GRADED - graded.length - (match ? 1 : 0);
  const echoCount = Math.max(0, Math.min(withVariants.length, room - 1));
  const echoed = new Set(shuffle(withVariants, rand).slice(0, echoCount));
  const reviewCount = Math.max(0, Math.min(REVIEW_ITEMS, room - echoCount));

  const asked = new Set(authored.map((e) => signature(e.prompt)));
  /** The first variant that asks something new, else the fallback's. */
  const pick = (ex: Exercise, fallback: () => ExercisePrompt | undefined): ExercisePrompt | undefined => {
    const fresh = variants.get(ex)!.find((p) => {
      const sig = signature(p);
      return sig === null || !asked.has(sig);
    });
    const chosen = fresh ?? fallback();
    if (chosen) asked.add(signature(chosen));
    return chosen;
  };

  const queue: SessionItem[] = [];
  const pending: Array<{ due: number; item: SessionItem }> = [];
  let seen = 0;
  for (const ex of authored) {
    if (ex.type === "TEACH") {
      queue.push(item(ex, ex.prompt, "new"));
      continue;
    }
    queue.push(item(ex, reshuffled(ex.prompt, rand), "new"));
    seen++;
    // No fresh format left means another exercise's echo already covers it.
    const echo = echoed.has(ex) ? pick(ex, () => undefined) : undefined;
    if (echo) pending.push({ due: seen + ECHO_GAP, item: item(ex, echo, "echo") });
    for (let i = 0; i < pending.length; ) {
      if (pending[i]!.due <= seen) queue.push(pending.splice(i, 1)[0]!.item);
      else i++;
    }
  }
  // Echoes still owed go in order, so the last exercise's isn't right after it.
  for (const p of pending.sort((a, b) => a.due - b.due)) queue.push(p.item);

  // Mixed review: the match round first, then exercises in another format —
  // preferring ones that didn't get an echo.
  if (match) {
    const source = authored.find((e) => e.type === "MATCH_PAIRS") ?? graded[graded.length - 1]!;
    queue.push(item(source, match, "review"));
  }
  // An echoed exercise with no phrase to test (grammar question, match round)
  // would only repeat verbatim, so it sits the review out.
  const reviewed = shuffle(withVariants, rand)
    .filter((e) => !(echoed.has(e) && pairOf(e.prompt) === null))
    .sort((a, b) => +echoed.has(a) - +echoed.has(b));
  for (const ex of reviewed.slice(0, reviewCount)) {
    // A third look, in yet another format when there is one.
    const prompt = pick(ex, () => variantsOf(ex.prompt, bank, rand)[0]);
    if (prompt) queue.push(item(ex, prompt, "review"));
  }
  return queue;
}

/**
 * Re-ask the exercise at `pos` (just missed) a few slots later, with its
 * options reshuffled. Returns the queue unchanged once it hit MAX_REQUEUES.
 */
export function requeueMistake(queue: SessionItem[], pos: number, rand: Rand = Math.random): SessionItem[] {
  const missed = queue[pos];
  if (!missed || missed.exercise.type === "TEACH") return queue;
  const requeues = (missed.requeues ?? 0) + 1;
  if (requeues > MAX_REQUEUES) return queue;
  const again: SessionItem = {
    key: `${missed.key}~${requeues}`,
    exercise: { ...missed.exercise, prompt: reshuffled(missed.exercise.prompt, rand) },
    kind: "mistake",
    requeues,
  };
  const at = Math.min(pos + 1 + MISTAKE_GAP, queue.length);
  return [...queue.slice(0, at), again, ...queue.slice(at)];
}
