import type { Session, SupabaseClient } from "@supabase/supabase-js";
import type { BadgeId } from "@/core/types";
import { useStore, type UserState } from "@/store/useStore";
import { getSupabase } from "./supabase";
import {
  sanitizeSnapshot,
  type ProgressSnapshot,
} from "../../api/_lib/progressMerge";

// Keeps the local store's progress in step with /api/progress for the
// signed-in user. The server merges every upload with what it already has and
// returns the result, so this side only needs to: push local changes, adopt
// the merged answer, and never adopt an answer that predates newer local work.

const DEBOUNCE_MS = 1000;
// Browsers cap keepalive request bodies at 64 KB.
const KEEPALIVE_MAX_BYTES = 60_000;

type Store = Pick<typeof useStore, "getState" | "setState" | "subscribe">;

export interface SyncDeps {
  store: Store;
  fetch: typeof fetch;
  getToken: () => Promise<string | null>;
}

export function snapshotOf(s: UserState): ProgressSnapshot {
  return {
    progress: s.progress,
    srs: s.srs,
    badges: s.badges,
    streakCount: s.streakCount,
    lastActiveDate: s.lastActiveDate,
  };
}

function progressChanged(a: UserState, b: UserState): boolean {
  return (
    a.progress !== b.progress ||
    a.srs !== b.srs ||
    a.badges !== b.badges ||
    a.streakCount !== b.streakCount ||
    a.lastActiveDate !== b.lastActiveDate
  );
}

export function createProgressSync(deps: SyncDeps) {
  const { store } = deps;
  let userId: string | null = null;
  let token: string | null = null; // last token seen, for the sync-only pagehide path
  let unsubscribe: (() => void) | null = null;
  let timer: ReturnType<typeof setTimeout> | null = null;
  let inFlight: Promise<boolean> | null = null;
  let pending = false; // local changes the server hasn't confirmed yet
  let changedDuringSend = false;
  let applying = false;

  function schedule() {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      timer = null;
      void sync();
    }, DEBOUNCE_MS);
  }

  function apply(merged: ProgressSnapshot) {
    applying = true;
    try {
      store.setState({
        progress: merged.progress,
        srs: merged.srs,
        badges: merged.badges as Record<BadgeId, number>,
        streakCount: merged.streakCount,
        lastActiveDate: merged.lastActiveDate,
      });
    } finally {
      applying = false;
    }
  }

  async function send(keepalive: boolean): Promise<boolean> {
    const uid = userId;
    const fresh = await deps.getToken();
    if (fresh) token = fresh;
    if (!uid || !token) return false;

    changedDuringSend = false;
    const body = JSON.stringify(snapshotOf(store.getState()));
    try {
      const res = await deps.fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body,
        keepalive: keepalive && body.length < KEEPALIVE_MAX_BYTES,
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const merged = sanitizeSnapshot(await res.json());
      if (userId !== uid) return false; // signed out / switched mid-request
      if (changedDuringSend) {
        // The answer is already stale; push again and adopt the next one.
        schedule();
      } else {
        pending = false;
        apply(merged);
      }
      return true;
    } catch (e) {
      // Retried on the next change, when the tab regains focus, or on reconnect.
      pending = true;
      console.warn("[berkut] progress sync failed", e);
      return false;
    }
  }

  // sync pushes local state and adopts the merged result. Also used purely to
  // pull, since an unchanged local snapshot merges to the server's state.
  async function sync(): Promise<boolean> {
    if (inFlight) {
      while (inFlight) await inFlight;
      if (!pending && !timer) return true;
    }
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    inFlight = send(false);
    try {
      return await inFlight;
    } finally {
      inFlight = null;
    }
  }

  function onVisibility() {
    if (document.visibilityState === "visible") void sync();
    else if (pending || timer) void send(true);
  }
  function onPageHide() {
    if (pending || timer) void send(true);
  }
  function onOnline() {
    if (pending) void sync();
  }

  function start(id: string) {
    if (userId === id) return;
    stop();
    const s = store.getState();
    if (s.syncedUserId && s.syncedUserId !== id) {
      // Local state belongs to another account; don't merge it into this one.
      s.reset();
    }
    store.getState().setSyncedUserId(id);
    userId = id;
    unsubscribe = store.subscribe((next, prev) => {
      if (applying || !progressChanged(next, prev)) return;
      pending = true;
      if (inFlight) changedDuringSend = true;
      schedule();
    });
    if (typeof window !== "undefined") {
      document.addEventListener("visibilitychange", onVisibility);
      window.addEventListener("pagehide", onPageHide);
      window.addEventListener("online", onOnline);
    }
    void sync();
  }

  function stop() {
    userId = null;
    token = null;
    unsubscribe?.();
    unsubscribe = null;
    if (timer) clearTimeout(timer);
    timer = null;
    pending = false;
    if (typeof window !== "undefined") {
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pagehide", onPageHide);
      window.removeEventListener("online", onOnline);
    }
  }

  // flush saves anything outstanding now. Returns false if the server couldn't
  // be reached, so callers about to wipe local state can warn first.
  async function flush(): Promise<boolean> {
    if (!userId) return true;
    if (!pending && !timer && !inFlight) return true;
    return sync();
  }

  return { start, stop, sync, flush };
}

let instance: ReturnType<typeof createProgressSync> | null = null;

function sessionToken(sb: SupabaseClient) {
  return async () => {
    const { data } = await sb.auth.getSession();
    return data.session?.access_token ?? null;
  };
}

// initProgressSync wires the default instance to Supabase auth. A no-op in
// localStorage-only mode (no Supabase env vars).
export function initProgressSync() {
  const sb = getSupabase();
  if (!sb || instance) return;
  const sync = createProgressSync({
    store: useStore,
    fetch: (...args) => fetch(...args),
    getToken: sessionToken(sb),
  });
  instance = sync;
  const follow = (session: Session | null) => {
    if (session) sync.start(session.user.id);
    else sync.stop();
  };
  sb.auth.getSession().then(({ data }) => follow(data.session));
  sb.auth.onAuthStateChange((_event, session) => follow(session));
}

export function flushProgress(): Promise<boolean> {
  return instance ? instance.flush() : Promise.resolve(true);
}

export function stopProgressSync() {
  instance?.stop();
}
