import type { VercelRequest, VercelResponse } from "@vercel/node";
import { adminClient } from "./_lib/supabase.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "method_not_allowed" });
  }

  try {
    const supabase = adminClient();
    const { data, error } = await supabase
      .from("user_profiles")
      .select("display_name, xp_weekly, league")
      .order("xp_weekly", { ascending: false })
      .limit(30);

    if (error) {
      console.error(error);
      return res.status(500).json({ error: "internal_error" });
    }

    const ranked = (data ?? []).map((row, i) => ({
      rank: i + 1,
      display_name: row.display_name,
      xp_weekly: row.xp_weekly ?? 0,
      league: row.league ?? "BRONZE",
    }));

    res.setHeader("Cache-Control", "public, s-maxage=60, stale-while-revalidate=300");
    return res.status(200).json(ranked);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "internal_error" });
  }
}
