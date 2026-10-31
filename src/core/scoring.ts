import { cyrillicToLatin } from "./transliterate";

export function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFC")
    .replace(/[\s.,!?;:"'’“”]+/g, " ")
    .trim();
}

export function answersMatch(a: string, b: string): boolean {
  return normalize(a) === normalize(b);
}

// Kazakh letters many keyboards lack, in Latin (2021) form, mapped to the
// letter people type instead: ә→а, ғ→г, қ→к, ң→н, ө→о, ү→у, і→и.
const KEYBOARD_FOLD: Record<string, string> = { ä: "a", ğ: "g", q: "k", ñ: "n", ö: "o", ü: "u", ı: "i" };

// Lower-case before transliterating: "И" → "İ" lower-cases to "i" + a dot.
const typedForm = (s: string) => cyrillicToLatin(normalize(s)).replace(/\u0307/g, "");
const fold = (s: string) => [...s].map((c) => KEYBOARD_FOLD[c] ?? c).join("");

/**
 * Grade a typed Kazakh answer, in either script. "close" means right apart
 * from Kazakh-only letters typed as their plain look-alikes (сәлем → салем).
 */
export function typedMatch(typed: string, answer: string): "exact" | "close" | "wrong" {
  const t = typedForm(typed);
  const a = typedForm(answer);
  if (!t) return "wrong";
  if (t === a) return "exact";
  return fold(t) === fold(a) ? "close" : "wrong";
}

export function arraysMatch(a: string[], b: string[]): boolean {
  if (a.length !== b.length) return false;
  return answersMatch(a.join(" "), b.join(" "));
}

// Levenshtein distance — used by the listening fallback.
export function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  if (!m) return n;
  if (!n) return m;
  const dp = new Array(n + 1).fill(0).map((_, i) => i);
  for (let i = 1; i <= m; i++) {
    let prev = dp[0]!;
    dp[0] = i;
    for (let j = 1; j <= n; j++) {
      const tmp = dp[j]!;
      dp[j] =
        a[i - 1] === b[j - 1]
          ? prev
          : 1 + Math.min(prev, dp[j]!, dp[j - 1]!);
      prev = tmp;
    }
  }
  return dp[n]!;
}

export function similarity(a: string, b: string): number {
  const na = normalize(a);
  const nb = normalize(b);
  if (!na.length && !nb.length) return 1;
  const d = levenshtein(na, nb);
  const max = Math.max(na.length, nb.length);
  return 1 - d / max;
}
