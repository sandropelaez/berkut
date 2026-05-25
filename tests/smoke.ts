// Smoke test — runs against the live deployment after each release.
// Exits non-zero on the first failed check so CI fails the deployment.
//
// Run: BASE_URL=https://berkutai.com npm run smoke
//
// Add a check by appending to CHECKS below. Each check is independent —
// one failure doesn't short-circuit the others, so we get a full report.

interface Check {
  name: string;
  fn: () => Promise<void>;
}

const BASE_URL = process.env.BASE_URL ?? "https://berkutai.com";

async function fetchJson(path: string, init: RequestInit = {}) {
  const res = await fetch(`${BASE_URL}${path}`, init);
  const text = await res.text();
  let json: any = null;
  try {
    json = JSON.parse(text);
  } catch {
    /* swallow — used below */
  }
  return { res, text, json };
}

function assert(cond: any, msg: string): asserts cond {
  if (!cond) throw new Error(msg);
}

const CHECKS: Check[] = [
  {
    name: "Home page returns HTML",
    fn: async () => {
      const res = await fetch(`${BASE_URL}/`);
      assert(res.ok, `Home returned ${res.status}`);
      const html = await res.text();
      assert(html.includes("<title>Berkut"), `Home missing <title>Berkut`);
    },
  },
  {
    name: "/api/health returns ok",
    fn: async () => {
      const { res, json } = await fetchJson("/api/health");
      assert(res.ok, `/api/health returned ${res.status}`);
      assert(json?.status === "ok", `unexpected health body: ${JSON.stringify(json)}`);
    },
  },
  {
    name: "/api/leaderboard returns an array (200)",
    fn: async () => {
      const { res, json } = await fetchJson("/api/leaderboard");
      assert(res.ok, `/api/leaderboard returned ${res.status}`);
      assert(Array.isArray(json), `leaderboard is not an array: ${typeof json}`);
    },
  },
  {
    name: "/api/content?action=languages returns kk",
    fn: async () => {
      const { res, json, text } = await fetchJson("/api/content?action=languages");
      assert(res.ok, `languages returned ${res.status} — ${text.slice(0, 120)}`);
      assert(Array.isArray(json), `expected array, got ${typeof json}`);
      const kk = json.find((l: any) => l.code === "kk");
      assert(kk, `Kazakh language row missing — did the seed migration run?`);
    },
  },
  {
    name: "/api/content?action=course&lang=kk returns ≥3 units",
    fn: async () => {
      const { res, json, text } = await fetchJson("/api/content?action=course&lang=kk");
      assert(res.ok, `course returned ${res.status} — ${text.slice(0, 120)}`);
      assert(
        json?.units?.length >= 3,
        `expected ≥3 units, got ${json?.units?.length}. ` +
          `If 0, run supabase/migrations/003_seed_content.sql.`,
      );
      assert(json?.lessons?.length > 0, `no lessons returned for kk`);
    },
  },
  {
    name: "/api/content?action=lesson&id=u1-l1 returns ≥10 exercises",
    fn: async () => {
      const { res, json } = await fetchJson("/api/content?action=lesson&id=u1-l1");
      assert(res.ok, `lesson returned ${res.status}`);
      assert(
        json?.exercises?.length >= 10,
        `expected ≥10 exercises in u1-l1, got ${json?.exercises?.length}`,
      );
    },
  },
  {
    name: "Admin endpoint requires auth",
    fn: async () => {
      // /api/admin?action=stats without a token must 401/403, never 500 or 200.
      const res = await fetch(`${BASE_URL}/api/admin?action=stats`);
      assert(
        res.status === 401 || res.status === 403,
        `admin stats unauth returned ${res.status} (expected 401/403)`,
      );
    },
  },
  {
    name: "Auth pages render without a session",
    fn: async () => {
      const res = await fetch(`${BASE_URL}/auth/login`);
      assert(res.ok, `/auth/login returned ${res.status}`);
      const html = await res.text();
      assert(html.includes("<title>Berkut"), "auth/login missing app shell");
    },
  },
];

async function main() {
  console.log(`Running ${CHECKS.length} smoke checks against ${BASE_URL}\n`);
  const failures: { name: string; error: string }[] = [];
  for (const check of CHECKS) {
    try {
      await check.fn();
      console.log(`  ✅ ${check.name}`);
    } catch (e: any) {
      console.log(`  ❌ ${check.name}\n     → ${e.message}`);
      failures.push({ name: check.name, error: e.message });
    }
  }
  console.log();
  if (failures.length) {
    console.log(`${failures.length}/${CHECKS.length} checks failed.`);
    process.exit(1);
  }
  console.log(`All ${CHECKS.length} checks passed.`);
}

main().catch((e) => {
  console.error("smoke runner crashed:", e);
  process.exit(2);
});
