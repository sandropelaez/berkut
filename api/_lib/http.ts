// Minimal request/response shapes the API handlers use. They match the
// subset of Node/Vercel's req/res that the handlers touch, so the same
// handlers run behind the Cloudflare Worker adapter (worker/index.ts) and in
// the unit tests' fakes.

export interface ApiRequest {
  method?: string;
  headers: Record<string, string | string[] | undefined>;
  query: Record<string, string | string[] | undefined>;
  body?: unknown;
}

export interface ApiResponse {
  status(code: number): ApiResponse;
  json(body: unknown): ApiResponse;
  send(body: unknown): ApiResponse;
  setHeader(name: string, value: string): ApiResponse;
  end(): ApiResponse;
}
