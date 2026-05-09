// Cyrillic ↔ Latin transliteration for Kazakh (2021 official Latin alphabet).
// Canonical storage form is Cyrillic; this module converts on render.
// Reference: §5.1 of the Berkut spec.

type Map = Record<string, string>;

const CYR_TO_LAT_PAIRS: Array<[string, string]> = [
  ["А", "A"], ["а", "a"],
  ["Ә", "Ä"], ["ә", "ä"],
  ["Б", "B"], ["б", "b"],
  ["В", "V"], ["в", "v"],
  ["Г", "G"], ["г", "g"],
  ["Ғ", "Ğ"], ["ғ", "ğ"],
  ["Д", "D"], ["д", "d"],
  ["Е", "E"], ["е", "e"],
  ["Ё", "Yo"], ["ё", "yo"],
  ["Ж", "J"], ["ж", "j"],
  ["З", "Z"], ["з", "z"],
  ["И", "İ"], ["и", "i"],
  ["Й", "İ"], ["й", "i"],
  ["К", "K"], ["к", "k"],
  ["Қ", "Q"], ["қ", "q"],
  ["Л", "L"], ["л", "l"],
  ["М", "M"], ["м", "m"],
  ["Н", "N"], ["н", "n"],
  ["Ң", "Ñ"], ["ң", "ñ"],
  ["О", "O"], ["о", "o"],
  ["Ө", "Ö"], ["ө", "ö"],
  ["П", "P"], ["п", "p"],
  ["Р", "R"], ["р", "r"],
  ["С", "S"], ["с", "s"],
  ["Т", "T"], ["т", "t"],
  ["У", "U"], ["у", "u"],
  ["Ұ", "U"], ["ұ", "u"],
  ["Ү", "Ü"], ["ү", "ü"],
  ["Ф", "F"], ["ф", "f"],
  ["Х", "H"], ["х", "h"],
  ["Һ", "H"], ["һ", "h"],
  ["Ц", "Ts"], ["ц", "ts"],
  ["Ч", "Ch"], ["ч", "ch"],
  ["Ш", "Ş"], ["ш", "ş"],
  ["Щ", "Şç"], ["щ", "şç"],
  ["Ъ", ""], ["ъ", ""],
  ["Ы", "Y"], ["ы", "y"],
  ["І", "I"], ["і", "ı"],
  ["Ь", ""], ["ь", ""],
  ["Э", "E"], ["э", "e"],
  ["Ю", "İu"], ["ю", "iu"],
  ["Я", "İa"], ["я", "ia"],
];

const CYR_TO_LAT: Map = Object.fromEntries(CYR_TO_LAT_PAIRS);

// Latin → Cyrillic. Best-effort reverse using a digraph-aware tokenizer.
const LAT_DIGRAPHS: Array<[string, string]> = [
  ["Yo", "Ё"], ["yo", "ё"],
  ["Ts", "Ц"], ["ts", "ц"],
  ["Ch", "Ч"], ["ch", "ч"],
  ["Şç", "Щ"], ["şç", "щ"],
  ["İu", "Ю"], ["iu", "ю"],
  ["İa", "Я"], ["ia", "я"],
];

const LAT_TO_CYR_SINGLES: Map = {
  "A": "А", "a": "а",
  "Ä": "Ә", "ä": "ә",
  "B": "Б", "b": "б",
  "V": "В", "v": "в",
  "G": "Г", "g": "г",
  "Ğ": "Ғ", "ğ": "ғ",
  "D": "Д", "d": "д",
  "E": "Е", "e": "е",
  "J": "Ж", "j": "ж",
  "Z": "З", "z": "з",
  "İ": "И", "i": "и",
  "K": "К", "k": "к",
  "Q": "Қ", "q": "қ",
  "L": "Л", "l": "л",
  "M": "М", "m": "м",
  "N": "Н", "n": "н",
  "Ñ": "Ң", "ñ": "ң",
  "O": "О", "o": "о",
  "Ö": "Ө", "ö": "ө",
  "P": "П", "p": "п",
  "R": "Р", "r": "р",
  "S": "С", "s": "с",
  "T": "Т", "t": "т",
  "U": "У", "u": "у",
  "Ü": "Ү", "ü": "ү",
  "F": "Ф", "f": "ф",
  "H": "Х", "h": "х",
  "Ş": "Ш", "ş": "ш",
  "Y": "Ы", "y": "ы",
  "I": "І", "ı": "і",
};

export function cyrillicToLatin(input: string): string {
  let out = "";
  for (const ch of input) {
    out += CYR_TO_LAT[ch] ?? ch;
  }
  return out;
}

export function latinToCyrillic(input: string): string {
  let out = "";
  let i = 0;
  while (i < input.length) {
    let matched = false;
    for (const [lat, cyr] of LAT_DIGRAPHS) {
      if (input.startsWith(lat, i)) {
        out += cyr;
        i += lat.length;
        matched = true;
        break;
      }
    }
    if (matched) continue;
    const ch = input[i]!;
    out += LAT_TO_CYR_SINGLES[ch] ?? ch;
    i += 1;
  }
  return out;
}

export function toScript(text: string, script: Script): string {
  if (script === "LATIN") return cyrillicToLatin(text);
  return text;
}

export type Script = "CYRILLIC" | "LATIN";

// Front (palatal) vs back (velar) vowels — used for vowel-harmony hints.
export const FRONT_VOWELS = new Set(["ә", "ө", "ү", "е", "і"]);
export const BACK_VOWELS = new Set(["а", "о", "ұ", "ы", "у"]);

export function vowelHarmony(word: string): "front" | "back" | "mixed" {
  let front = 0;
  let back = 0;
  for (const ch of word.toLowerCase()) {
    if (FRONT_VOWELS.has(ch)) front++;
    else if (BACK_VOWELS.has(ch)) back++;
  }
  if (front && !back) return "front";
  if (back && !front) return "back";
  return "mixed";
}
