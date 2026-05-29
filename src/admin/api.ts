import { getSupabase } from "@/core/supabase";

async function getToken(): Promise<string | null> {
  const sb = getSupabase();
  if (!sb) return null;
  const { data } = await sb.auth.getSession();
  return data.session?.access_token ?? null;
}

// Translate a path-style call (e.g. "/users/abc?q=foo") into a query-string
// URL against /api/admin (e.g. /api/admin?action=users&id=abc&q=foo).
// This shim lets the admin pages keep their clean REST-like call sites
// while the backend is a single ?action= dispatcher.
function buildUrl(path: string): string {
  // Split off any existing query string and merge.
  const [rawPath, rawQuery = ""] = path.split("?");
  const segments = (rawPath ?? "").split("/").filter(Boolean);
  const params = new URLSearchParams(rawQuery);

  if (segments.length === 0) {
    return "/api/admin";
  }

  const action = segments[0]!;
  params.set("action", action);

  switch (action) {
    case "stats":
    case "audit":
    case "admins":
      // No path-segment IDs. Body or query carries everything.
      break;
    case "users":
      // /users/<id>
      if (segments[1]) params.set("id", segments[1]);
      break;
    case "reports":
      // /reports/<id>
      if (segments[1]) params.set("id", segments[1]);
      break;
    case "content":
      // /content/<kind>[/<id>]
      if (segments[1]) params.set("kind", segments[1]);
      if (segments[2]) params.set("id", segments[2]);
      break;
    default:
      // Unknown segments — let the server 404 it.
      break;
  }

  return `/api/admin?${params.toString()}`;
}

export async function adminFetch<T = unknown>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const token = await getToken();
  const url = buildUrl(path);
  const res = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token ?? ""}`,
      ...(init.headers ?? {}),
    },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`${res.status}: ${body}`);
  }
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}
