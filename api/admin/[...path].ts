import type { VercelRequest, VercelResponse } from "@vercel/node";
import { requireAdmin, recordAudit, type AdminContext } from "../_lib/admin.js";

// Single catch-all admin router. Vercel Hobby plan has a hard limit on
// serverless functions, so we route within one handler instead of one file
// per endpoint. Each branch is small and the dispatch is method+path-based.

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const segments = ([] as string[])
    .concat(((req.query.path as string[] | string | undefined) ?? []) as any)
    .filter(Boolean);

  // /api/admin/admins/grant requires super_admin; everything else needs admin.
  const needsSuper =
    segments[0] === "admins" && (req.method === "POST" || req.method === "DELETE");
  const ctx = await requireAdmin(req, res, needsSuper);
  if (!ctx) return;

  try {
    switch (segments[0]) {
      case "stats":
        return await getStats(ctx, res);
      case "users":
        return await handleUsers(ctx, req, res, segments.slice(1));
      case "admins":
        return await handleAdmins(ctx, req, res);
      case "audit":
        return await getAudit(ctx, req, res);
      case "content":
        return await handleContent(ctx, req, res, segments.slice(1));
      case undefined:
        return res.status(200).json({ ok: true, message: "Berkut admin API" });
      default:
        return res.status(404).json({ error: "not_found", segments });
    }
  } catch (e: any) {
    console.error("admin handler error", e);
    return res.status(500).json({ error: "internal_error", detail: e?.message });
  }
}

// ─── /api/admin/stats ───────────────────────────────────────────────────
async function getStats(ctx: AdminContext, res: VercelResponse) {
  const svc = ctx.service;
  const dayMs = 24 * 60 * 60 * 1000;
  const now = Date.now();
  const day = new Date(now - dayMs).toISOString();
  const week = new Date(now - 7 * dayMs).toISOString();
  const month = new Date(now - 30 * dayMs).toISOString();

  const [users, dau, wau, mau, verified, lessonsCompleted, activeStreaks] = await Promise.all([
    svc.from("user_profiles").select("*", { count: "exact", head: true }),
    svc.from("user_profiles").select("*", { count: "exact", head: true }).gt("last_active_at", day),
    svc.from("user_profiles").select("*", { count: "exact", head: true }).gt("last_active_at", week),
    svc.from("user_profiles").select("*", { count: "exact", head: true }).gt("last_active_at", month),
    svc.from("user_profiles").select("user_id", { count: "exact", head: true }),
    svc.from("user_progress").select("completed_lessons"),
    svc.from("user_profiles").select("streak_count").gt("streak_count", 0),
  ]);

  const totalLessons = (lessonsCompleted.data ?? []).reduce((acc, row) => {
    const c = row.completed_lessons as Record<string, unknown> | null;
    return acc + (c ? Object.keys(c).length : 0);
  }, 0);

  const recent = await svc
    .from("user_profiles")
    .select("user_id, display_name, created_at, xp_total, role")
    .order("created_at", { ascending: false })
    .limit(10);

  return res.status(200).json({
    users_total: users.count ?? 0,
    dau: dau.count ?? 0,
    wau: wau.count ?? 0,
    mau: mau.count ?? 0,
    verified_users: verified.count ?? 0,
    lessons_completed_total: totalLessons,
    active_streaks: activeStreaks.data?.length ?? 0,
    recent_signups: recent.data ?? [],
  });
}

// ─── /api/admin/users[/{id}] ────────────────────────────────────────────
async function handleUsers(
  ctx: AdminContext,
  req: VercelRequest,
  res: VercelResponse,
  rest: string[],
) {
  const id = rest[0];
  const svc = ctx.service;

  if (!id) {
    // List with filters
    const q = ((req.query.q as string) ?? "").trim();
    const limit = Math.min(100, Math.max(1, parseInt((req.query.limit as string) ?? "30", 10)));
    let query = svc
      .from("user_profiles")
      .select(
        "user_id, display_name, role, xp_total, xp_weekly, streak_count, league, last_active_at, created_at",
        { count: "exact" },
      )
      .order("created_at", { ascending: false })
      .limit(limit);
    if (q) query = query.ilike("display_name", `%${q}%`);
    const { data, count, error } = await query;
    if (error) return res.status(500).json({ error: error.message });

    // Hydrate emails from auth.users (admin API)
    if (data && data.length) {
      const ids = data.map((r) => r.user_id);
      const { data: authData } = await svc.auth.admin.listUsers({ perPage: 200 });
      const byId = new Map<string, string | null>();
      for (const u of authData?.users ?? []) byId.set(u.id, u.email ?? null);
      for (const r of data as any[]) r.email = byId.get(r.user_id) ?? null;
    }

    return res.status(200).json({ users: data ?? [], total: count ?? 0 });
  }

  // Single user
  if (req.method === "GET") {
    const { data: profile } = await svc.from("user_profiles").select("*").eq("user_id", id).maybeSingle();
    if (!profile) return res.status(404).json({ error: "not_found" });

    const [progress, auth] = await Promise.all([
      svc.from("user_progress").select("*").eq("user_id", id).maybeSingle(),
      svc.auth.admin.getUserById(id),
    ]);

    return res.status(200).json({
      profile,
      progress: progress.data ?? null,
      email: auth.data?.user?.email ?? null,
      email_confirmed: !!auth.data?.user?.email_confirmed_at,
      providers: auth.data?.user?.app_metadata?.providers ?? [],
      last_sign_in_at: auth.data?.user?.last_sign_in_at ?? null,
    });
  }

  if (req.method === "PATCH") {
    const body = (req.body as any) ?? {};
    const before = await svc.from("user_profiles").select("*").eq("user_id", id).maybeSingle();
    const allowed: Record<string, unknown> = {};
    if (typeof body.display_name === "string" && body.display_name.length >= 2)
      allowed.display_name = body.display_name.slice(0, 30);
    if (typeof body.xp_total === "number") allowed.xp_total = body.xp_total;
    if (typeof body.xp_weekly === "number") allowed.xp_weekly = body.xp_weekly;
    if (typeof body.streak_count === "number") allowed.streak_count = body.streak_count;
    if (typeof body.gems === "number") allowed.gems = body.gems;
    if (typeof body.league === "string") allowed.league = body.league;

    if (!Object.keys(allowed).length) return res.status(400).json({ error: "no_fields" });

    const { data: updated, error } = await svc
      .from("user_profiles")
      .update(allowed)
      .eq("user_id", id)
      .select()
      .maybeSingle();
    if (error) return res.status(500).json({ error: error.message });

    await recordAudit(ctx, {
      action: "user_update",
      target_type: "user",
      target_id: id,
      before_state: before.data,
      after_state: updated,
    });
    return res.status(200).json(updated);
  }

  if (req.method === "DELETE") {
    const before = await svc.from("user_profiles").select("*").eq("user_id", id).maybeSingle();
    const { error } = await svc.auth.admin.deleteUser(id);
    if (error) return res.status(500).json({ error: error.message });
    await recordAudit(ctx, {
      action: "user_delete",
      target_type: "user",
      target_id: id,
      before_state: before.data,
    });
    return res.status(200).json({ ok: true });
  }

  res.setHeader("Allow", "GET, PATCH, DELETE");
  return res.status(405).json({ error: "method_not_allowed" });
}

// ─── /api/admin/admins (grant/revoke admin role) ────────────────────────
async function handleAdmins(ctx: AdminContext, req: VercelRequest, res: VercelResponse) {
  const svc = ctx.service;

  if (req.method === "GET") {
    const { data, error } = await svc
      .from("user_profiles")
      .select("user_id, display_name, role, last_active_at, created_at")
      .in("role", ["content_editor", "admin", "super_admin"])
      .order("role", { ascending: false });
    if (error) return res.status(500).json({ error: error.message });

    if (data?.length) {
      const { data: authData } = await svc.auth.admin.listUsers({ perPage: 200 });
      const byId = new Map<string, string | null>();
      for (const u of authData?.users ?? []) byId.set(u.id, u.email ?? null);
      for (const r of data as any[]) r.email = byId.get(r.user_id) ?? null;
    }
    return res.status(200).json(data ?? []);
  }

  if (req.method === "POST") {
    // Grant role. Body: { email: string, role: 'content_editor' | 'admin' }
    const body = (req.body as any) ?? {};
    const email = String(body.email ?? "").toLowerCase().trim();
    const role = String(body.role ?? "");
    if (!email) return res.status(400).json({ error: "email_required" });
    if (!["content_editor", "admin"].includes(role))
      return res.status(400).json({ error: "invalid_role" });

    const { data: authData } = await svc.auth.admin.listUsers({ perPage: 1000 });
    const target = (authData?.users ?? []).find((u) => u.email?.toLowerCase() === email);
    if (!target) return res.status(404).json({ error: "user_not_found", email });

    const before = await svc.from("user_profiles").select("role").eq("user_id", target.id).maybeSingle();
    const { error } = await svc.from("user_profiles").update({ role }).eq("user_id", target.id);
    if (error) return res.status(500).json({ error: error.message });

    await recordAudit(ctx, {
      action: "admin_grant",
      target_type: "admin",
      target_id: target.id,
      before_state: before.data,
      after_state: { role },
      metadata: { email },
    });
    return res.status(200).json({ ok: true, user_id: target.id, role });
  }

  if (req.method === "DELETE") {
    const body = (req.body as any) ?? {};
    const user_id = String(body.user_id ?? "");
    if (!user_id) return res.status(400).json({ error: "user_id_required" });
    if (user_id === ctx.userId) return res.status(400).json({ error: "cannot_revoke_self" });

    const before = await svc.from("user_profiles").select("role").eq("user_id", user_id).maybeSingle();
    if (before.data?.role === "super_admin")
      return res.status(403).json({ error: "cannot_revoke_super_admin" });

    const { error } = await svc.from("user_profiles").update({ role: "user" }).eq("user_id", user_id);
    if (error) return res.status(500).json({ error: error.message });

    await recordAudit(ctx, {
      action: "admin_revoke",
      target_type: "admin",
      target_id: user_id,
      before_state: before.data,
      after_state: { role: "user" },
    });
    return res.status(200).json({ ok: true });
  }

  res.setHeader("Allow", "GET, POST, DELETE");
  return res.status(405).json({ error: "method_not_allowed" });
}

// ─── /api/admin/audit ───────────────────────────────────────────────────
async function getAudit(ctx: AdminContext, req: VercelRequest, res: VercelResponse) {
  const limit = Math.min(200, Math.max(1, parseInt((req.query.limit as string) ?? "50", 10)));
  const { data, error } = await ctx.service
    .from("admin_audit_log")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) return res.status(500).json({ error: error.message });
  return res.status(200).json(data ?? []);
}

// ─── /api/admin/content/<kind>[/{id}] ───────────────────────────────────
async function handleContent(
  ctx: AdminContext,
  req: VercelRequest,
  res: VercelResponse,
  rest: string[],
) {
  const kind = rest[0]; // 'languages' | 'units' | 'lessons' | 'exercises' | 'vocab'
  const id = rest[1];
  const svc = ctx.service;
  const validKinds = ["languages", "units", "lessons", "exercises", "vocab"] as const;
  if (!validKinds.includes(kind as any)) {
    return res.status(404).json({ error: "unknown_content_kind", kind });
  }

  if (req.method === "GET") {
    if (id) {
      const { data, error } = await svc.from(kind).select("*").eq("id", id).maybeSingle();
      if (error) return res.status(500).json({ error: error.message });
      if (!data) return res.status(404).json({ error: "not_found" });
      return res.status(200).json(data);
    }
    const lang = req.query.language_code as string | undefined;
    const unit = req.query.unit_id as string | undefined;
    const lesson = req.query.lesson_id as string | undefined;
    let query = svc.from(kind).select("*");
    if (lang && kind === "units") query = query.eq("language_code", lang);
    if (unit && (kind === "lessons" || kind === "vocab")) query = query.eq("unit_id", unit);
    if (lesson && kind === "exercises") query = query.eq("lesson_id", lesson);
    query = query.order(kind === "languages" ? "sort_order" : "order");
    const { data, error } = await query;
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data ?? []);
  }

  if (req.method === "POST" || req.method === "PATCH") {
    const body = (req.body as any) ?? {};
    let result;
    let before = null;
    if (req.method === "PATCH" && id) {
      const beforeQ = await svc.from(kind).select("*").eq("id", id).maybeSingle();
      before = beforeQ.data;
      result = await svc.from(kind).update(body).eq("id", id).select().maybeSingle();
    } else {
      // POST: include id in body
      result = await svc.from(kind).insert(body).select().maybeSingle();
    }
    if (result.error) return res.status(500).json({ error: result.error.message });

    // Snapshot lesson revisions when a lesson or its exercises are edited
    if (req.method === "PATCH" && (kind === "lessons" || kind === "exercises")) {
      const lessonId = kind === "lessons" ? id! : (before as any)?.lesson_id;
      if (lessonId) {
        const [lesson, exercises, vocab] = await Promise.all([
          svc.from("lessons").select("*").eq("id", lessonId).maybeSingle(),
          svc.from("exercises").select("*").eq("lesson_id", lessonId).order("order"),
          svc.from("vocab").select("*").eq("unit_id", (lesson.data as any)?.unit_id ?? ""),
        ]);
        await svc.from("lesson_revisions").insert({
          lesson_id: lessonId,
          snapshot: { lesson: lesson.data, exercises: exercises.data, vocab: vocab.data },
          edited_by: ctx.userId,
        });
      }
    }

    await recordAudit(ctx, {
      action: `${kind}_${req.method === "POST" ? "create" : "update"}`,
      target_type: kind,
      target_id: id ?? (result.data as any)?.id ?? null,
      before_state: before,
      after_state: result.data,
    });
    return res.status(200).json(result.data);
  }

  if (req.method === "DELETE" && id) {
    const beforeQ = await svc.from(kind).select("*").eq("id", id).maybeSingle();
    const { error } = await svc.from(kind).delete().eq("id", id);
    if (error) return res.status(500).json({ error: error.message });
    await recordAudit(ctx, {
      action: `${kind}_delete`,
      target_type: kind,
      target_id: id,
      before_state: beforeQ.data,
    });
    return res.status(200).json({ ok: true });
  }

  res.setHeader("Allow", "GET, POST, PATCH, DELETE");
  return res.status(405).json({ error: "method_not_allowed" });
}
