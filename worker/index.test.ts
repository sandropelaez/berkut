import { describe, expect, it, vi } from "vitest";

// Stand-in handler that echoes what the adapter passed it.
vi.mock("../api/progress", () => ({
  default: (req: any, res: any) =>
    res.status(201).setHeader("x-test", "1").json({ method: req.method, query: req.query, body: req.body, auth: req.headers.authorization }),
}));

const { default: worker } = await import("./index");

const env: any = {
  ASSETS: { fetch: async () => new Response("<html>spa</html>", { headers: { "content-type": "text/html" } }) },
  SUPABASE_URL: "https://example.supabase.co",
  SUPABASE_ANON_KEY: "anon",
  SUPABASE_SERVICE_ROLE_KEY: "service",
};
const ctx = { waitUntil: () => {} };

describe("worker", () => {
  it("serves /api/health from the API handlers", async () => {
    const res = await worker.fetch(new Request("https://berkutai.com/api/health"), env, ctx);
    expect(res.status).toBe(200);
    expect((await res.json()).status).toBe("ok");
  });

  it("passes method, query, JSON body and headers to the handler", async () => {
    const res = await worker.fetch(
      new Request("https://berkutai.com/api/progress?a=1&b=2&b=3", {
        method: "POST",
        headers: { Authorization: "Bearer t", "content-type": "application/json" },
        body: JSON.stringify({ x: 1 }),
      }),
      env,
      ctx,
    );
    expect(res.status).toBe(201);
    expect(res.headers.get("x-test")).toBe("1");
    expect(await res.json()).toEqual({ method: "POST", query: { a: "1", b: ["2", "3"] }, body: { x: 1 }, auth: "Bearer t" });
  });

  it("exposes the Supabase settings to the handlers through process.env", async () => {
    await worker.fetch(new Request("https://berkutai.com/api/health"), env, ctx);
    expect(process.env.SUPABASE_SERVICE_ROLE_KEY).toBe("service");
  });

  it("404s unknown API paths and hands everything else to the static assets", async () => {
    expect((await worker.fetch(new Request("https://berkutai.com/api/nope"), env, ctx)).status).toBe(404);
    expect(await (await worker.fetch(new Request("https://berkutai.com/learn"), env, ctx)).text()).toContain("spa");
  });
});
