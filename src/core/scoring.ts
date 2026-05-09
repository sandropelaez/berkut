// XP rules per §6.1.
export const XP = {
  CORRECT_FIRST: 10,
  CORRECT_SECOND: 5,
  COMPLETE_LESSON: 20,
  PERFECT_LESSON: 30,
  COMPLETE_UNIT: 100,
  STREAK_DAY: 15,
};

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
