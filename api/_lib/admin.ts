import type { VercelRequest, VercelResponse } from "@vercel/node";
import type { SupabaseClient } from "@supabase/supabase-js";
import { adminClient, getBearer, userClient } from "./supabase.js";

type Role = "user" | "content_editor" | "admin" | "super_admin";
const PRIVILEGED: Role[] = ["content_editor", "admin", "super_admin"];

export interface AdminContext {
  userId: string;
  email: string | null;
  role: Role;
  user: SupabaseClient;
  service: SupabaseClient;
}

export async function requireAdmin(
  req: VercelRequest,
  res: VercelResponse,
  needSuperAdmin = false,
): Promise<AdminContext | null> {
  const token = getBearer(req as any);
  if (!token) {
    res.status(401).json({ error: "unauthorized" });
    return null;
  }

  const user = userClient(token);
  const { data: authData, error: authError } = await user.auth.getUser();
  if (authError || !authData?.user) {
    res.status(401).json({ error: "unauthorized" });
    return null;
  }

  const service = adminClient();
  const { data: profile, error: profileError } = await service
    .from("user_profiles")
    .select("role")
    .eq("user_id", authData.user.id)
    .maybeSingle();

  if (profileError || !profile) {
    res.status(403).json({ error: "forbidden" });
    return null;
  }

  const role = (profile.role ?? "user") as Role;
  if (!PRIVILEGED.includes(role)) {
    res.status(403).json({ error: "forbidden" });
    return null;
  }
  if (needSuperAdmin && role !== "super_admin") {
    res.status(403).json({ error: "super_admin_required" });
    return null;
  }

  return {
    userId: authData.user.id,
    email: authData.user.email ?? null,
    role,
    user,
    service,
  };
}

export async function recordAudit(
  ctx: AdminContext,
  args: {
    action: string;
    target_type?: string;
    target_id?: string;
    before_state?: unknown;
    after_state?: unknown;
    metadata?: unknown;
  },
): Promise<void> {
  await ctx.service.from("admin_audit_log").insert({
    actor_id: ctx.userId,
    actor_email: ctx.email,
    action: args.action,
    target_type: args.target_type ?? null,
    target_id: args.target_id ?? null,
    before_state: args.before_state ?? null,
    after_state: args.after_state ?? null,
    metadata: args.metadata ?? null,
  });
}
