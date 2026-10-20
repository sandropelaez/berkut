// Exercises api/progress.ts against an in-memory stand-in for Supabase whose
// tables only accept the columns prod actually has — the previous handler
// read and wrote counters on the wrong table and failed on every call.
import { beforeEach, describe, expect, it, vi } from "vitest";

const COLUMNS: Record<string, string[]> = {
  user_progress: ["user_id", "completed_lessons", "srs", "badges", "last_active_date", "updated_at"],
  user_profiles: [
    "user_id", "display_name", "avatar_url", "script_pref", "league", "xp_total", "xp_weekly",
    "streak_count", "streak_freezes", "gems", "last_active_at", "created_at", "updated_at", "role",
  ],
};

type Row = Record<string, unknown>;
let tables: Record<string, Row[]>;

function check(table: string, cols: string[]) {
  const bad = cols.filter((c) => !COLUMNS[table]!.includes(c));
  return bad.length ? { message: `column ${bad.join(",")} does not exist on ${table}` } : null;
}

const fakeClient = {
  auth: { getUser: async () => ({ data: { user: { id: "u1" } }, error: null }) },
  from(table: string) {
    return {
      select(cols: string) {
        const list = cols.split(",").map((c) => c.trim());
        return {
          eq: (col: string, v: unknown) => ({
            maybeSingle: async () => {
              const error = check(table, list);
              if (error) return { data: null, error };
              const row = tables[table]!.find((r) => r[col] === v);
              return { data: row ? Object.fromEntries(list.map((c) => [c, row[c]])) : null, error: null };
            },
          }),
        };
      },
      async upsert(row: Row) {
        const error = check(table, Object.keys(row));
        if (error) return { error };
        const rows = tables[table]!;
        const i = rows.findIndex((r) => r.user_id === row.user_id);
        if (i >= 0) rows[i] = { ...rows[i], ...row };
        else rows.push(row);
        return { error: null };
      },
      update(patch: Row) {
        return {
          eq: async (col: string, v: unknown) => {
            const error = check(table, Object.keys(patch));
            if (error) return { error };
            for (const r of tables[table]!) if (r[col] === v) Object.assign(r, patch);
            return { error: null };
          },
        };
      },
    };
  },
};

vi.mock("./supabase.js", () => ({
  getBearer: () => "token",
  userClient: () => fakeClient,
}));

const { default: handler } = await import("../progress");

function call(method: string, body?: unknown) {
  const res: any = {
    statusCode: 0,
    body: undefined,
    status(c: number) { this.statusCode = c; return this; },
    json(b: unknown) { this.body = b; return this; },
    setHeader() {},
  };
  return handler({ method, body, headers: {} } as any, res).then(() => res);
}

beforeEach(() => {
  tables = {
    user_progress: [{ user_id: "u1", completed_lessons: {}, srs: {}, badges: {}, last_active_date: null }],
    user_profiles: [{ user_id: "u1", xp_total: 0, xp_weekly: 0, gems: 0, streak_count: 0, last_active_at: null, role: "user" }],
  };
});

describe("/api/progress", () => {
  it("saves a posted snapshot to the right tables and returns it", async () => {
    const res = await call("POST", {
      progress: { "u1-l1": { completed: true, score: 30, perfectRun: true, completedAt: 1 } },
      srs: {},
      badges: { first_lesson: 1 },
      xpTotal: 45,
      xpWeekly: 45,
      gems: 5,
      streakCount: 1,
      lastActiveDate: "2026-10-20",
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.progress["u1-l1"].completed).toBe(true);
    expect(tables.user_progress![0]).toMatchObject({
      completed_lessons: { "u1-l1": { completed: true, score: 30 } },
      badges: { first_lesson: 1 },
      last_active_date: "2026-10-20",
    });
    expect(tables.user_profiles![0]).toMatchObject({ xp_total: 45, gems: 5, streak_count: 1, role: "user" });
    expect(tables.user_profiles![0]!.last_active_at).toEqual(expect.any(String));

    const got = await call("GET");
    expect(got.statusCode).toBe(200);
    expect(got.body).toEqual(res.body);
  });

  it("merges instead of overwriting when a device posts stale state", async () => {
    await call("POST", {
      progress: { a: { completed: true, score: 10 }, b: { completed: true, score: 10 } },
      xpTotal: 100,
    });
    const res = await call("POST", { progress: { c: { completed: true, score: 10 } }, xpTotal: 20 });
    expect(Object.keys(res.body.progress).sort()).toEqual(["a", "b", "c"]);
    expect(res.body.xpTotal).toBe(100);
    expect(Object.keys(tables.user_progress![0]!.completed_lessons as object).sort()).toEqual(["a", "b", "c"]);
  });

  it("creates the progress row if the signup trigger never did", async () => {
    tables.user_progress = [];
    const res = await call("POST", { progress: { a: { completed: true, score: 1 } } });
    expect(res.statusCode).toBe(200);
    expect(tables.user_progress).toHaveLength(1);
  });
});
