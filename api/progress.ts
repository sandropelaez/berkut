import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getBearer, userClient } from "./_lib/supabase.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const token = getBearer(req as any);
  if (!token) return res.status(401).json({ error: "unauthorized" });

  const supabase = userClient(token);
  const { data: auth, error: authError } = await supabase.auth.getUser();
  if (authError || !auth?.user) {
    return res.status(401).json({ error: "unauthorized" });
  }
  const userId = auth.user.id;

  if (req.method === "GET") {
    const { data, error } = await supabase
      .from("user_progress")
      .select("xp_total, xp_weekly, streak_count, last_active_at, gems, league, completed_lessons, srs")
      .eq("user_id", userId)
      .maybeSingle();
    if (error) return res.status(500).json({ error: "internal_error" });
    return res.status(200).json(data ?? null);
  }

  if (req.method === "POST") {
    const body = req.body && typeof req.body === "object" ? req.body : {};
    const {
      xp_total,
      xp_weekly,
      streak_count,
      gems,
      completed_lessons,
      srs,
    } = body as Record<string, unknown>;

    const update: Record<string, unknown> = {
      user_id: userId,
      xp_total: typeof xp_total === "number" ? xp_total : 0,
      xp_weekly: typeof xp_weekly === "number" ? xp_weekly : 0,
      streak_count: typeof streak_count === "number" ? streak_count : 0,
      gems: typeof gems === "number" ? gems : 0,
      last_active_at: new Date().toISOString(),
      completed_lessons: completed_lessons ?? {},
      srs: srs ?? {},
    };

    const { error } = await supabase
      .from("user_progress")
      .upsert(update, { onConflict: "user_id" });
    if (error) {
      console.error(error);
      return res.status(500).json({ error: "internal_error" });
    }
    return res.status(200).json({ ok: true });
  }

  res.setHeader("Allow", "GET, POST");
  return res.status(405).json({ error: "method_not_allowed" });
}
