// Cyrillic ↔ Latin transliteration using the official 2021 Kazakh Latin alphabet mapping

const cyrillicToLatinMap: Record<string, string> = {
  А: "A", а: "a", Ә: "Ä", ә: "ä", Б: "B", б: "b",
  В: "V", в: "v", Г: "G", г: "g", Ғ: "Ğ", ғ: "ğ",
  Д: "D", д: "d", Е: "E", е: "e", Ё: "Yo", ё: "yo",
  Ж: "J", ж: "j", З: "Z", з: "z", И: "I", и: "i",
  Й: "İ", й: "i", К: "K", к: "k", Қ: "Q", қ: "q",
  Л: "L", л: "l", М: "M", м: "m", Н: "N", н: "n",
  Ң: "Ñ", ң: "ñ", О: "O", о: "o", Ө: "Ö", ө: "ö",
  П: "P", п: "p", Р: "R", р: "r", С: "S", с: "s",
  Т: "T", т: "t", У: "U", у: "u", Ұ: "U", ұ: "u",
  Ү: "Ü", ү: "ü", Ф: "F", ф: "f", Х: "H", х: "h",
  Һ: "H", һ: "h", Ц: "Ts", ц: "ts", Ч: "Ch", ч: "ch",
  Ш: "Ş", ш: "ş", Щ: "Şş", щ: "şş", Ъ: "", ъ: "",
  Ы: "Y", ы: "y", І: "I", і: "i", Ь: "", ь: "",
  Э: "E", э: "e", Ю: "Yu", ю: "yu", Я: "Ya", я: "ya",
};

const latinToCyrillicMap: Record<string, string> = {};
for (const [cyr, lat] of Object.entries(cyrillicToLatinMap)) {
  if (lat && !latinToCyrillicMap[lat]) {
    latinToCyrillicMap[lat] = cyr;
  }
}

export type Script = "CYRILLIC" | "LATIN";

export function transliterate(text: string, toScript: Script): string {
  if (toScript === "CYRILLIC") return text;
  return text
    .split("")
    .map((ch) => cyrillicToLatinMap[ch] ?? ch)
    .join("");
}

export function transliterateToLatin(text: string): string {
  return transliterate(text, "LATIN");
}
