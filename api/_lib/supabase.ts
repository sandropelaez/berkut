import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export function adminClient(): SupabaseClient {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set");
  }
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export function userClient(accessToken: string): SupabaseClient {
  const url = process.env.SUPABASE_URL;
  const anon = process.env.SUPABASE_ANON_KEY;
  if (!url || !anon) {
    throw new Error("SUPABASE_URL and SUPABASE_ANON_KEY must be set");
  }
  return createClient(url, anon, {
    global: { headers: { Authorization: `Bearer ${accessToken}` } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export function getBearer(req: { headers: Record<string, string | string[] | undefined> }): string | null {
  const raw = req.headers["authorization"] ?? req.headers["Authorization"];
  if (!raw) return null;
  const value = Array.isArray(raw) ? raw[0]! : raw;
  if (!value.toLowerCase().startsWith("bearer ")) return null;
  return value.slice(7).trim();
}
