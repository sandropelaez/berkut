import type { VercelRequest, VercelResponse } from "@vercel/node";
import { adminClient } from "../_lib/supabase.js";

// Public, read-only content endpoints. RLS lets anyone authenticated read
// status='active' rows. We use the admin client to bypass RLS for /languages
// (so unauthenticated picker / pre-login screens work) and rely on app logic
// to only expose 'active' content.

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "method_not_allowed" });
  }

  // Parse path segments from req.url — see api/admin/[...path].ts for why.
  const url = new URL(req.url ?? "/", "http://x");
  const segments = url.pathname
    .split("/")
    .filter(Boolean)
    .slice(2); // drop ['api', 'content']

  try {
    const svc = adminClient();

    // /api/content/languages
    if (segments[0] === "languages" && !segments[1]) {
      const { data, error } = await svc
        .from("languages")
        .select("code, name_en, name_native, flag_emoji, sort_order")
        .eq("status", "active")
        .order("sort_order");
      if (error) return res.status(500).json({ error: error.message });
      res.setHeader("Cache-Control", "public, s-maxage=300, stale-while-revalidate=600");
      return res.status(200).json(data ?? []);
    }

    // /api/content/courses/:lang  →  units + lessons + vocab for a language
    if (segments[0] === "courses" && segments[1]) {
      const lang = segments[1];
      const [{ data: language }, { data: units }] = await Promise.all([
        svc.from("languages").select("*").eq("code", lang).eq("status", "active").maybeSingle(),
        svc.from("units").select("*").eq("language_code", lang).eq("status", "active").order("order"),
      ]);
      if (!language) return res.status(404).json({ error: "language_not_found" });

      const unitIds = (units ?? []).map((u) => u.id);
      const [{ data: lessons }, { data: vocab }] = await Promise.all([
        unitIds.length
          ? svc
              .from("lessons")
              .select("*")
              .in("unit_id", unitIds)
              .eq("status", "active")
              .order("order")
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

    // /api/content/lessons/:id  →  lesson + exercises + vocab (unit-scoped)
    if (segments[0] === "lessons" && segments[1]) {
      const lessonId = segments[1];
      const { data: lesson } = await svc.from("lessons").select("*").eq("id", lessonId).maybeSingle();
      if (!lesson) return res.status(404).json({ error: "lesson_not_found" });

      const [{ data: exercises }, { data: vocab }] = await Promise.all([
        svc.from("exercises").select("*").eq("lesson_id", lessonId).eq("status", "active").order("order"),
        svc.from("vocab").select("*").eq("unit_id", (lesson as any).unit_id),
      ]);
      res.setHeader("Cache-Control", "public, s-maxage=60, stale-while-revalidate=300");
      return res.status(200).json({ lesson, exercises: exercises ?? [], vocab: vocab ?? [] });
    }

    return res.status(404).json({ error: "not_found", segments });
  } catch (e: any) {
    console.error("content handler error", e);
    return res.status(500).json({ error: "internal_error", detail: e?.message });
  }
}
