import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useStore } from "@/store/useStore";
import { createProgressSync } from "./progressSync";
import {
  emptySnapshot,
  mergeSnapshots,
  sanitizeSnapshot,
  type ProgressSnapshot,
} from "../../api/_lib/progressMerge";

// A fake /api/progress backed by per-user snapshots, merging like the real one.
function fakeServer() {
  const db: Record<string, ProgressSnapshot> = {};
  let offline = false;
  let gate: Promise<void> | null = null;
  const posts: ProgressSnapshot[] = [];
  const fetchFn = vi.fn(async (_url: unknown, init?: RequestInit) => {
    if (offline) throw new TypeError("Failed to fetch");
    const user = String((init!.headers as Record<string, string>).Authorization).replace("Bearer ", "");
    const incoming = sanitizeSnapshot(JSON.parse(String(init!.body)));
    posts.push(incoming);
    if (gate) await gate;
    db[user] = mergeSnapshots(db[user] ?? emptySnapshot(), incoming);
    return new Response(JSON.stringify(db[user]), { status: 200 });
  }) as unknown as typeof fetch;
  return {
    db,
    posts,
    fetchFn,
    setOffline: (v: boolean) => (offline = v),
    hold() {
      let release!: () => void;
      gate = new Promise((r) => (release = r));
      return () => {
        gate = null;
        release();
      };
    },
  };
}

let server: ReturnType<typeof fakeServer>;
let currentToken = "alice";

function makeSync() {
  return createProgressSync({
    store: useStore,
    fetch: server.fetchFn,
    getToken: async () => currentToken,
  });
}

const settle = () => vi.advanceTimersByTimeAsync(0);

beforeEach(() => {
  vi.useFakeTimers();
  vi.spyOn(console, "warn").mockImplementation(() => {});
  server = fakeServer();
  currentToken = "alice";
  useStore.getState().reset();
});
afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe("progress sync", () => {
  it("restores saved progress on sign-in (e.g. after logout or on a new device)", async () => {
    server.db.alice = sanitizeSnapshot({
      progress: { "u1-l1": { completed: true, score: 30 } },
      xpTotal: 45,
    });
    const sync = makeSync();
    sync.start("alice");
    await settle();
    expect(useStore.getState().progress["u1-l1"]?.completed).toBe(true);
    expect(useStore.getState().xpTotal).toBe(45);
    sync.stop();
  });

  it("uploads a completed lesson shortly after it is recorded", async () => {
    const sync = makeSync();
    sync.start("alice");
    await settle();
    useStore.getState().recordLesson("u1-l2", 20, false);
    expect(server.db.alice?.progress["u1-l2"]).toBeUndefined();
    await vi.advanceTimersByTimeAsync(1000);
    expect(server.db.alice?.progress["u1-l2"]?.completed).toBe(true);
    expect(server.db.alice?.xpTotal).toBe(useStore.getState().xpTotal);
    sync.stop();
  });

  it("uploads progress made before sync existed on first sign-in", async () => {
    useStore.getState().recordLesson("u1-l1", 10, true);
    const sync = makeSync();
    sync.start("alice");
    await settle();
    expect(server.db.alice?.progress["u1-l1"]?.completed).toBe(true);
    expect(useStore.getState().syncedUserId).toBe("alice");
    sync.stop();
  });

  it("doesn't carry one account's local progress into another account", async () => {
    const sync = makeSync();
    sync.start("alice");
    await settle();
    useStore.getState().recordLesson("u1-l1", 10, false);
    await vi.advanceTimersByTimeAsync(1000);
    sync.stop();

    currentToken = "bob";
    sync.start("bob");
    await settle();
    expect(server.db.bob?.progress["u1-l1"]).toBeUndefined();
    expect(useStore.getState().progress["u1-l1"]).toBeUndefined();
    sync.stop();
  });

  it("doesn't roll back a lesson finished while a save was in flight", async () => {
    const sync = makeSync();
    sync.start("alice");
    await settle();

    useStore.getState().recordLesson("a", 10, false);
    const release = server.hold();
    await vi.advanceTimersByTimeAsync(1000); // first save is now in flight
    useStore.getState().recordLesson("b", 10, false);
    release();
    await settle();
    expect(useStore.getState().progress.b?.completed).toBe(true); // stale reply not applied

    await vi.advanceTimersByTimeAsync(1000);
    expect(Object.keys(server.db.alice!.progress).sort()).toEqual(["a", "b"]);
    expect(Object.keys(useStore.getState().progress).sort()).toEqual(["a", "b"]);
    sync.stop();
  });

  it("flush reports failure when offline so logout can warn, and saves once back online", async () => {
    const sync = makeSync();
    sync.start("alice");
    await settle();
    server.setOffline(true);
    useStore.getState().recordLesson("a", 10, false);
    await expect(sync.flush()).resolves.toBe(false);
    expect(useStore.getState().progress.a?.completed).toBe(true); // kept locally

    server.setOffline(false);
    await expect(sync.flush()).resolves.toBe(true);
    expect(server.db.alice?.progress.a?.completed).toBe(true);
    sync.stop();
  });
});
