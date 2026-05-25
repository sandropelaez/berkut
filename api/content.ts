import type { VercelRequest, VercelResponse } from "@vercel/node";
import { adminClient } from "./_lib/supabase.js";

// Single endpoint that fans out by ?action. Avoids Vercel catch-all
// routing pitfalls — URLs look like /api/content?action=course&lang=kk.

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "method_not_allowed" });
  }

  const action = (req.query.action as string) ?? "";

  try {
    const svc = adminClient();

    if (action === "languages") {
      const { data, error } = await svc
        .from("languages")
        .select("code, name_en, name_native, flag_emoji, sort_order")
        .eq("status", "active")
        .order("sort_order");
      if (error) return res.status(500).json({ error: error.message });
      res.setHeader("Cache-Control", "public, s-maxage=300, stale-while-revalidate=600");
      return res.status(200).json(data ?? []);
    }

    if (action === "course") {
      const lang = (req.query.lang as string) ?? "";
      if (!lang) return res.status(400).json({ error: "lang_required" });

      const [{ data: language }, { data: units }] = await Promise.all([
        svc.from("languages").select("*").eq("code", lang).eq("status", "active").maybeSingle(),
        svc.from("units").select("*").eq("language_code", lang).eq("status", "active").order("order"),
      ]);
      if (!language) return res.status(404).json({ error: "language_not_found" });

      const unitIds = (units ?? []).map((u) => u.id);
      const [{ data: lessons }, { data: vocab }] = await Promise.all([
        unitIds.length
          ? svc.from("lessons").select("*").in("unit_id", unitIds).eq("status", "active").order("order")
          : Promise.resolve({ data: [] as any[] }),
        unitIds.length
          ? svc.from("vocab").select("*").in("unit_id", unitIds)
          : Promise.resolve({ data: [] as any[] }),
      ]);

      res.setHeader("Cache-Control", "public, s-maxage=60, stale-while-revalidate=300");
      return res.status(200).json({
        language,
        units: units ?? [],
        lessons: lessons ?? [],
        vocab: vocab ?? [],
      });
    }

    if (action === "lesson") {
      const id = (req.query.id as string) ?? "";
      if (!id) return res.status(400).json({ error: "id_required" });

      const { data: lesson } = await svc.from("lessons").select("*").eq("id", id).maybeSingle();
      if (!lesson) return res.status(404).json({ error: "lesson_not_found" });

      const [{ data: exercises }, { data: vocab }] = await Promise.all([
        svc.from("exercises").select("*").eq("lesson_id", id).eq("status", "active").order("order"),
        svc.from("vocab").select("*").eq("unit_id", (lesson as any).unit_id),
      ]);
      res.setHeader("Cache-Control", "public, s-maxage=60, stale-while-revalidate=300");
      return res.status(200).json({ lesson, exercises: exercises ?? [], vocab: vocab ?? [] });
    }

    return res.status(400).json({ error: "unknown_action", action });
  } catch (e: any) {
    console.error("content handler error", e);
    return res.status(500).json({ error: "internal_error", detail: e?.message });
  }
}
