// Shared by api/progress.ts and the client sync (src/core/progressSync.ts).
// No imports on purpose: this file is compiled both by Vite and by the Vercel
// function bundler.

export interface LessonProgressWire {
  lessonId: string;
  completed: boolean;
  score: number;
  perfectRun: boolean;
  completedAt?: number;
}

export interface SrsItemWire {
  vocabId: string;
  easeFactor: number;
  interval: number;
  repetitions: number;
  nextReview: number;
  lastReview?: number;
}

// Everything that counts as "progress" — the part of the client store that
// must survive a logout, a cleared browser, or a second device.
export interface ProgressSnapshot {
  progress: Record<string, LessonProgressWire>;
  srs: Record<string, SrsItemWire>;
  badges: Record<string, number>;
  xpTotal: number;
  xpWeekly: number;
  gems: number;
  streakCount: number;
  lastActiveDate: string | null; // local calendar day, YYYY-MM-DD
}

const MAX_KEYS = 5000;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export function emptySnapshot(): ProgressSnapshot {
  return {
    progress: {},
    srs: {},
    badges: {},
    xpTotal: 0,
    xpWeekly: 0,
    gems: 0,
    streakCount: 0,
    lastActiveDate: null,
  };
}

function isObj(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}
function count(v: unknown): number {
  return typeof v === "number" && Number.isFinite(v) && v >= 0 ? Math.floor(v) : 0;
}
function num(v: unknown): number | undefined {
  return typeof v === "number" && Number.isFinite(v) ? v : undefined;
}

// sanitizeSnapshot turns untrusted JSON (a request body, or a jsonb column)
// into a well-formed snapshot, dropping anything malformed.
export function sanitizeSnapshot(raw: unknown): ProgressSnapshot {
  const out = emptySnapshot();
  if (!isObj(raw)) return out;

  if (isObj(raw.progress)) {
    for (const [id, p] of Object.entries(raw.progress).slice(0, MAX_KEYS)) {
      if (!isObj(p)) continue;
      out.progress[id] = {
        lessonId: id,
        completed: p.completed === true,
        score: count(p.score),
        perfectRun: p.perfectRun === true,
        completedAt: num(p.completedAt),
      };
    }
  }

  if (isObj(raw.srs)) {
    for (const [id, s] of Object.entries(raw.srs).slice(0, MAX_KEYS)) {
      if (!isObj(s)) continue;
      const easeFactor = num(s.easeFactor);
      const nextReview = num(s.nextReview);
      if (easeFactor === undefined || nextReview === undefined) continue;
      out.srs[id] = {
        vocabId: id,
        easeFactor,
        interval: count(s.interval),
        repetitions: count(s.repetitions),
        nextReview,
        lastReview: num(s.lastReview),
      };
    }
  }

  if (isObj(raw.badges)) {
    for (const [id, at] of Object.entries(raw.badges).slice(0, 100)) {
      const t = num(at);
      if (t !== undefined && t > 0) out.badges[id] = t;
    }
  }

  out.xpTotal = count(raw.xpTotal);
  out.xpWeekly = count(raw.xpWeekly);
  out.gems = count(raw.gems);
  out.streakCount = count(raw.streakCount);
  out.lastActiveDate =
    typeof raw.lastActiveDate === "string" && DATE_RE.test(raw.lastActiveDate)
      ? raw.lastActiveDate
      : null;
  return out;
}

function mergeLesson(a: LessonProgressWire, b: LessonProgressWire): LessonProgressWire {
  const completedAt =
    a.completedAt === undefined
      ? b.completedAt
      : b.completedAt === undefined
        ? a.completedAt
        : Math.max(a.completedAt, b.completedAt);
  return {
    lessonId: a.lessonId,
    completed: a.completed || b.completed,
    score: Math.max(a.score, b.score),
    perfectRun: a.perfectRun || b.perfectRun,
    completedAt,
  };
}

// mergeSnapshots combines two devices' views without losing work from either:
// lessons and badges are unioned, counters only go up, each SRS card keeps its
// most recent review, and the streak comes from whichever side was active
// latest. Order matters only for exact ties, where `b` wins.
export function mergeSnapshots(a: ProgressSnapshot, b: ProgressSnapshot): ProgressSnapshot {
  const progress: Record<string, LessonProgressWire> = { ...a.progress };
  for (const [id, p] of Object.entries(b.progress)) {
    progress[id] = progress[id] ? mergeLesson(progress[id]!, p) : p;
  }

  const srs: Record<string, SrsItemWire> = { ...a.srs };
  for (const [id, s] of Object.entries(b.srs)) {
    const cur = srs[id];
    if (!cur || (s.lastReview ?? -1) >= (cur.lastReview ?? -1)) srs[id] = s;
  }

  const badges: Record<string, number> = { ...a.badges };
  for (const [id, at] of Object.entries(b.badges)) {
    badges[id] = badges[id] ? Math.min(badges[id]!, at) : at;
  }

  let streakCount: number;
  let lastActiveDate: string | null;
  if (a.lastActiveDate === b.lastActiveDate) {
    streakCount = Math.max(a.streakCount, b.streakCount);
    lastActiveDate = a.lastActiveDate;
  } else if (!b.lastActiveDate || (a.lastActiveDate && a.lastActiveDate > b.lastActiveDate)) {
    streakCount = a.streakCount;
    lastActiveDate = a.lastActiveDate;
  } else {
    streakCount = b.streakCount;
    lastActiveDate = b.lastActiveDate;
  }

  return {
    progress,
    srs,
    badges,
    xpTotal: Math.max(a.xpTotal, b.xpTotal),
    xpWeekly: Math.max(a.xpWeekly, b.xpWeekly),
    gems: Math.max(a.gems, b.gems),
    streakCount,
    lastActiveDate,
  };
}
