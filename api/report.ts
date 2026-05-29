import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getBearer, userClient, adminClient } from "./_lib/supabase.js";

const VALID_REASONS = new Set([
  "wrong_translation",
  "grammar_error",
  "typo",
  "bad_audio",
  "too_hard",
  "too_easy",
  "offensive",
  "other",
]);

// POST /api/report
// Body: { exercise_id: string, reason: <enum>, comment?: string }
//
// Auth required. The submission is attributed to the JWT user and goes
// into public.exercise_reports. Server enforces rate limit (8/hour/user)
// to prevent abuse; the trigger on exercise_reports bumps exercises.report_count.
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "method_not_allowed" });
  }

  const token = getBearer(req as any);
  if (!token) return res.status(401).json({ error: "unauthorized" });

  const user = userClient(token);
  const { data: auth, error: authError } = await user.auth.getUser();
  if (authError || !auth?.user) {
    return res.status(401).json({ error: "unauthorized" });
  }
  const userId = auth.user.id;
  const userEmail = auth.user.email ?? null;

  const body = (req.body as any) ?? {};
  const exerciseId = String(body.exercise_id ?? "");
  const reason = String(body.reason ?? "");
  const comment = typeof body.comment === "string" ? body.comment.slice(0, 500) : null;

  if (!exerciseId) return res.status(400).json({ error: "exercise_id_required" });
  if (!VALID_REASONS.has(reason)) return res.status(400).json({ error: "invalid_reason" });

  const svc = adminClient();

  // Rate limit: max 8 open reports/user/hour, and prevent dup report per (user, exercise) for 24h.
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  const { count: recentCount } = await svc
    .from("exercise_reports")
    .select("*", { count: "exact", head: true })
    .eq("reporter_id", userId)
    .gt("created_at", oneHourAgo);
  if ((recentCount ?? 0) >= 8) {
    return res.status(429).json({ error: "rate_limited", message: "Too many reports — try again later." });
  }

  const { data: dup } = await svc
    .from("exercise_reports")
    .select("id")
    .eq("reporter_id", userId)
    .eq("exercise_id", exerciseId)
    .gt("created_at", dayAgo)
    .maybeSingle();
  if (dup) {
    return res.status(200).json({ ok: true, deduped: true });
  }

  // Look up lesson_id for denormalisation
  const { data: exercise } = await svc
    .from("exercises")
    .select("lesson_id")
    .eq("id", exerciseId)
    .maybeSingle();
  if (!exercise) return res.status(404).json({ error: "exercise_not_found" });

  const { error } = await svc.from("exercise_reports").insert({
    exercise_id: exerciseId,
    lesson_id: exercise.lesson_id,
    reporter_id: userId,
    reporter_email: userEmail,
    reason,
    comment,
  });
  if (error) {
    console.error(error);
    return res.status(500).json({ error: "internal_error" });
  }

  return res.status(200).json({ ok: true });
}
