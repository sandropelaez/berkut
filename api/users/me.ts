import type { ApiRequest, ApiResponse } from "../_lib/http.js";
import { adminClient, getBearer, userClient } from "../_lib/supabase.js";

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method !== "DELETE") {
    res.setHeader("Allow", "DELETE");
    return res.status(405).json({ error: "method_not_allowed" });
  }

  const token = getBearer(req as any);
  if (!token) return res.status(401).json({ error: "unauthorized" });

  const supabase = userClient(token);
  const { data: auth, error: authError } = await supabase.auth.getUser();
  if (authError || !auth?.user) {
    return res.status(401).json({ error: "unauthorized" });
  }
  const userId = auth.user.id;

  // Hard-delete via admin client. RLS cascade on auth.users handles the rest.
  const admin = adminClient();
  const { error } = await admin.auth.admin.deleteUser(userId);
  if (error) {
    console.error(error);
    return res.status(500).json({ error: "internal_error" });
  }
  return res.status(200).json({ ok: true });
}
