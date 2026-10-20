import type { VercelRequest, VercelResponse } from "@vercel/node";
import type { SupabaseClient } from "@supabase/supabase-js";
import { getBearer, userClient } from "./_lib/supabase.js";
import {
  mergeSnapshots,
  sanitizeSnapshot,
  type ProgressSnapshot,
} from "./_lib/progressMerge.js";

// GET  /api/progress → the user's saved ProgressSnapshot
// POST /api/progress → merge the posted snapshot into the saved one, save, and
//                      return the merged result for the client to adopt.
//
// Lessons, SRS, badges and the streak day live in user_progress; the streak
// count and last-active time live in user_profiles, where the admin stats
// read them.

async function load(supabase: SupabaseClient, userId: string): Promise<ProgressSnapshot> {
  const [progress, profile] = await Promise.all([
    supabase
      .from("user_progress")
      .select("completed_lessons, srs, badges, last_active_date")
      .eq("user_id", userId)
      .maybeSingle(),
    supabase
      .from("user_profiles")
      .select("streak_count")
      .eq("user_id", userId)
      .maybeSingle(),
  ]);
  if (progress.error) throw progress.error;
  if (profile.error) throw profile.error;
  return sanitizeSnapshot({
    progress: progress.data?.completed_lessons,
    srs: progress.data?.srs,
    badges: progress.data?.badges,
    lastActiveDate: progress.data?.last_active_date,
    streakCount: profile.data?.streak_count,
  });
}

async function save(supabase: SupabaseClient, userId: string, s: ProgressSnapshot) {
  const [progress, profile] = await Promise.all([
    supabase.from("user_progress").upsert(
      {
        user_id: userId,
        completed_lessons: s.progress,
        srs: s.srs,
        badges: s.badges,
        last_active_date: s.lastActiveDate,
      },
      { onConflict: "user_id" },
    ),
    supabase
      .from("user_profiles")
      .update({
        streak_count: s.streakCount,
        last_active_at: new Date().toISOString(),
      })
      .eq("user_id", userId),
  ]);
  if (progress.error) throw progress.error;
  if (profile.error) throw profile.error;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const token = getBearer(req as any);
  if (!token) return res.status(401).json({ error: "unauthorized" });

  const supabase = userClient(token);
  const { data: auth, error: authError } = await supabase.auth.getUser();
  if (authError || !auth?.user) {
    return res.status(401).json({ error: "unauthorized" });
  }
  const userId = auth.user.id;

  try {
    if (req.method === "GET") {
      return res.status(200).json(await load(supabase, userId));
    }

    if (req.method === "POST") {
      const incoming = sanitizeSnapshot(req.body);
      const merged = mergeSnapshots(await load(supabase, userId), incoming);
      await save(supabase, userId, merged);
      return res.status(200).json(merged);
    }
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "internal_error" });
  }

  res.setHeader("Allow", "GET, POST");
  return res.status(405).json({ error: "method_not_allowed" });
}
