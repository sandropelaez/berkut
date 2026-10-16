// Kazakh suffix selection — vowel harmony + consonant assimilation.
//
// Encodes the rules as they're taught in the beginner course (A1.1):
//   SOFT vowels    ә ө ү і е         → soft suffix (-лер, -мін, -ім …)
//   STRONG vowels  а о ұ ы я ю       → strong suffix (-лар, -мын, -ым …)
// The deciding vowel is the LAST vowel of the word. `у` behaves like a
// consonant (sonorant, like р / й) at the end of a word: тау → таулар,
// су → суым.
//
// Word-final consonant groups:
//   sonorants  р у й  |  л  |  м н ң
//   voiced     ж з
//   voiceless  п ф с ш к қ т ч щ ц х һ б в г д ғ
//     (б в г д are pronounced voiceless at the end of a word: клуб [клуп])

const SOFT = new Set(["ә", "ө", "ү", "і", "е", "э"]);
const STRONG = new Set(["а", "о", "ұ", "ы", "я", "ю", "ё"]);
// `и` can be either (ит → иттер, Берлин → Берлинде, Италия → Италияда), so
// it never decides on its own: the other vowels do, and a word whose only
// vowel is `и` is treated as soft.
// `у` counts as a vowel for harmony only when it's not word-final.
const VOWEL_FOR_HARMONY = (ch: string) =>
  SOFT.has(ch) || STRONG.has(ch) || ch === "у" || ch === "и";

const VOICELESS = new Set([..."пфсшкқтчщцхһбвгдғ"]);

type Final = "vowel" | "ruy" | "l" | "mnng" | "voiced" | "voiceless";

function lastLetter(word: string): string {
  const letters = word.toLowerCase().replace(/[^а-яёәіңғүұқөһ]/g, "");
  // Soft/hard signs are silent — look at the letter before them.
  const trimmed = letters.replace(/[ьъ]+$/, "");
  return trimmed[trimmed.length - 1] ?? "";
}

export function isSoft(word: string): boolean {
  const w = word.toLowerCase();
  for (let i = w.length - 1; i >= 0; i--) {
    const ch = w[i]!;
    if (SOFT.has(ch)) return true;
    if (STRONG.has(ch)) return false;
    if (ch === "у" && i !== w.length - 1) {
      // Medial у is a strong vowel (e.g. тұз, but also су-…): treat as strong.
      return false;
    }
  }
  return w.includes("и");
}

export function finalClass(word: string): Final {
  const ch = lastLetter(word);
  if (ch === "у" || ch === "р" || ch === "й") return "ruy";
  if (VOWEL_FOR_HARMONY(ch)) return "vowel";
  if (ch === "л") return "l";
  if (ch === "м" || ch === "н" || ch === "ң") return "mnng";
  if (ch === "ж" || ch === "з") return "voiced";
  if (VOICELESS.has(ch)) return "voiceless";
  return "vowel";
}

const pick = (word: string, strong: string, soft: string) => (isSoft(word) ? soft : strong);

// ─── Plural: -лар/-лер, -дар/-дер, -тар/-тер ──────────────────────────────
export function pluralSuffix(word: string): string {
  const f = finalClass(word);
  if (f === "vowel" || f === "ruy") return pick(word, "лар", "лер");
  if (f === "l" || f === "mnng" || f === "voiced") return pick(word, "дар", "дер");
  return pick(word, "тар", "тер");
}

// ─── Personal endings on nouns / adjectives ("I am …", "we are …") ───────
export type Person = "мен" | "сен" | "сіз" | "ол" | "біз" | "сендер" | "сіздер" | "олар";

export function personalSuffix(word: string, person: Person): string {
  const f = finalClass(word);
  switch (person) {
    case "мен":
      if (f === "voiced") return pick(word, "бын", "бін");
      if (f === "voiceless") return pick(word, "пын", "пін");
      return pick(word, "мын", "мін");
    case "біз":
      if (f === "voiced" || f === "mnng") return pick(word, "быз", "біз");
      if (f === "voiceless") return pick(word, "пыз", "піз");
      return pick(word, "мыз", "міз");
    case "сен":
      return pick(word, "сың", "сің");
    case "сіз":
      return pick(word, "сыз", "сіз");
    case "сендер":
      return pick(word, "сыңдар", "сіңдер");
    case "сіздер":
      return pick(word, "сыздар", "сіздер");
    case "ол":
    case "олар":
      return "";
  }
}

// ─── Possessive endings (my / your / his-her / our) ──────────────────────
export type Possessor = "менің" | "сенің" | "сіздің" | "оның" | "біздің";

// Final қ / к / п voice to ғ / г / б before a vowel-initial suffix.
function voiceFinal(word: string): string {
  const last = word[word.length - 1];
  if (last === "қ") return word.slice(0, -1) + "ғ";
  if (last === "к") return word.slice(0, -1) + "г";
  if (last === "п") return word.slice(0, -1) + "б";
  return word;
}

export function possessive(word: string, who: Possessor): string {
  const endsInVowel = finalClass(word) === "vowel";
  const base = endsInVowel ? word : voiceFinal(word);
  const s = (strong: string, soft: string) => base + pick(word, strong, soft);
  switch (who) {
    case "менің":
      return endsInVowel ? word + "м" : s("ым", "ім");
    case "сенің":
      return endsInVowel ? word + "ң" : s("ың", "ің");
    case "сіздің":
      return endsInVowel ? s("ңыз", "ңіз") : s("ыңыз", "іңіз");
    case "оның":
      return endsInVowel ? s("сы", "сі") : s("ы", "і");
    case "біздің":
      return endsInVowel ? s("мыз", "міз") : s("ымыз", "іміз");
  }
}

// ─── Locative "in / on / at": -да/-де, -та/-те ───────────────────────────
export function locativeSuffix(word: string): string {
  return finalClass(word) === "voiceless" ? pick(word, "та", "те") : pick(word, "да", "де");
}

// ─── Genitive "'s / of": -ның/-нің, -дың/-дің, -тың/-тің ─────────────────
export function genitiveSuffix(word: string): string {
  const f = finalClass(word);
  if (f === "vowel" || f === "mnng") return pick(word, "ның", "нің");
  if (f === "voiceless") return pick(word, "тың", "тің");
  return pick(word, "дың", "дің");
}

// ─── Question particle ма/ме, ба/бе, па/пе ───────────────────────────────
export function questionParticle(word: string): string {
  const f = finalClass(word);
  if (f === "voiced" || f === "mnng") return pick(word, "ба", "бе");
  if (f === "voiceless") return pick(word, "па", "пе");
  return pick(word, "ма", "ме");
}

// ─── Present / future simple: stem + а/е/й + personal ending ─────────────
// Works for regular verbs whose infinitive ends in -у (бару, ішу, жасау).
// Irregular stems such as оқу → оқи- are not handled.
export function verbStem(infinitive: string): string {
  return infinitive.replace(/у$/, "");
}

const PRESENT_ENDINGS: Record<Person, [string, string]> = {
  мен: ["мын", "мін"],
  сен: ["сың", "сің"],
  сіз: ["сыз", "сіз"],
  ол: ["ды", "ді"],
  біз: ["мыз", "міз"],
  сендер: ["сыңдар", "сіңдер"],
  сіздер: ["сыздар", "сіздер"],
  олар: ["ды", "ді"],
};

export function presentTense(infinitive: string, person: Person): string {
  const stem = verbStem(infinitive);
  const [strong, soft] = PRESENT_ENDINGS[person];
  const ending = pick(stem, strong, soft);
  if (finalClass(stem) === "vowel") return stem + "й" + ending;
  return stem + pick(stem, "а", "е") + ending;
}

export function presentNegative(infinitive: string, person: Person): string {
  const stem = verbStem(infinitive);
  const f = finalClass(stem);
  const neg =
    f === "voiceless"
      ? pick(stem, "па", "пе")
      : f === "voiced" || f === "mnng"
        ? pick(stem, "ба", "бе")
        : pick(stem, "ма", "ме");
  const [strong, soft] = PRESENT_ENDINGS[person];
  return stem + neg + "й" + pick(stem, strong, soft);
}
