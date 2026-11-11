// Cloudflare Worker entry: serves the Vite build from static assets and runs
// the API handlers in api/ for /api/* (wrangler.jsonc sends only /api/* here
// first; everything else is served straight from dist/ with SPA fallback).

import type { ApiRequest, ApiResponse } from "../api/_lib/http";
import admin from "../api/admin";
import content from "../api/content";
import health from "../api/health";
import progress from "../api/progress";
import report from "../api/report";
import usersMe from "../api/users/me";

type Handler = (req: ApiRequest, res: ApiResponse) => unknown;

const ROUTES: Record<string, Handler> = {
  "/api/admin": admin,
  "/api/content": content,
  "/api/health": health,
  "/api/progress": progress,
  "/api/report": report,
  "/api/users/me": usersMe,
};

export interface Env {
  ASSETS: { fetch(request: Request): Promise<Response> };
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
}

interface Ctx {
  waitUntil(promise: Promise<unknown>): void;
}

// Collects what a handler writes into a Fetch API Response.
class ResponseBuilder implements ApiResponse {
  statusCode = 200;
  headers = new Headers();
  body: BodyInit | null = null;
  sent = false;

  status(code: number) {
    this.statusCode = code;
    return this;
  }
  setHeader(name: string, value: string) {
    this.headers.set(name, value);
    return this;
  }
  json(body: unknown) {
    if (!this.headers.has("content-type")) {
      this.headers.set("content-type", "application/json; charset=utf-8");
    }
    this.body = JSON.stringify(body);
    this.sent = true;
    return this;
  }
  send(body: unknown) {
    if (typeof body === "object" && body !== null) return this.json(body);
    this.body = body == null ? null : String(body);
    this.sent = true;
    return this;
  }
  end() {
    this.sent = true;
    return this;
  }
  toResponse() {
    return new Response(this.body, { status: this.statusCode, headers: this.headers });
  }
}

async function toApiRequest(request: Request, url: URL): Promise<ApiRequest> {
  const headers: Record<string, string> = {};
  request.headers.forEach((value, key) => (headers[key] = value));

  const query: Record<string, string | string[]> = {};
  url.searchParams.forEach((value, key) => {
    const prev = query[key];
    query[key] = prev === undefined ? value : ([] as string[]).concat(prev, value);
  });

  let body: unknown = undefined;
  if (request.method !== "GET" && request.method !== "HEAD") {
    const text = await request.text();
    if (text) {
      try {
        body = JSON.parse(text);
      } catch {
        body = text;
      }
    }
  }
  return { method: request.method, headers, query, body };
}

// The handlers read Supabase settings from process.env, as they did on Node.
function exposeEnv(env: Env) {
  const g = globalThis as any;
  g.process ??= {};
  g.process.env ??= {};
  const target = g.process.env as Record<string, string>;
  for (const key of ["SUPABASE_URL", "SUPABASE_ANON_KEY", "SUPABASE_SERVICE_ROLE_KEY"] as const) {
    if (typeof env[key] === "string") target[key] = env[key];
  }
}

export async function handleApi(request: Request, env: Env, ctx: Ctx): Promise<Response> {
  const url = new URL(request.url);
  const path = url.pathname.replace(/\/+$/, "");
  const handler = ROUTES[path];
  if (!handler) {
    return Response.json({ error: "not_found" }, { status: 404 });
  }

  // Public content is the same for everyone: serve it from Cloudflare's edge
  // cache, honouring the handler's s-maxage, so most loads skip Supabase.
  const cacheable = request.method === "GET" && path === "/api/content";
  const cache = cacheable ? (globalThis as any).caches?.default : undefined;
  if (cache) {
    const hit = await cache.match(request);
    if (hit) return hit;
  }

  exposeEnv(env);
  const res = new ResponseBuilder();
  try {
    await handler(await toApiRequest(request, url), res);
    if (!res.sent) throw new Error("handler returned without a response");
  } catch (e: any) {
    console.error("api handler error", path, e);
    return Response.json({ error: "internal_error" }, { status: 500 });
  }
  const response = res.toResponse();

  if (cache && response.status === 200 && /s-maxage=\d+/.test(response.headers.get("cache-control") ?? "")) {
    ctx.waitUntil(cache.put(request, response.clone()));
  }
  return response;
}

export default {
  async fetch(request: Request, env: Env, ctx: Ctx): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname === "/api" || url.pathname.startsWith("/api/")) {
      return handleApi(request, env, ctx);
    }
    return env.ASSETS.fetch(request);
  },
};
