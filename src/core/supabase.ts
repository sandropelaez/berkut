import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

let client: SupabaseClient | null = null;

// Read the "Stay signed in" preference at module load. localStorage = persistent
// session (default). sessionStorage = session dies when the browser closes.
function pickStorage(): Storage | undefined {
  if (typeof window === "undefined") return undefined;
  try {
    const flag = window.localStorage.getItem("berkut-stay-signed-in");
    if (flag === "false") return window.sessionStorage;
    return window.localStorage;
  } catch {
    return window.localStorage;
  }
}

export function getSupabase(): SupabaseClient | null {
  if (client) return client;
  if (!url || !anon) return null;
  client = createClient(url, anon, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storage: pickStorage(),
    },
  });
  return client;
}

export function isSupabaseConfigured(): boolean {
  return Boolean(url && anon);
}
