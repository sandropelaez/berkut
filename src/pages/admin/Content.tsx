import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { adminFetch } from "@/admin/api";

interface Language {
  code: string;
  name_en: string;
  name_native: string;
  flag_emoji: string;
  status: string;
  sort_order: number;
}
interface Unit {
  id: string;
  language_code: string;
  order: number;
  title_native: string;
  title_en: string;
  cefr_level: string;
  emoji: string;
  status: string;
}
interface Lesson {
  id: string;
  unit_id: string;
  order: number;
  title_native: string;
  title_en: string;
  status: string;
}

export default function AdminContent() {
  const [languages, setLanguages] = useState<Language[]>([]);
  const [selectedLang, setSelectedLang] = useState<string | null>(null);
  const [units, setUnits] = useState<Unit[]>([]);
  const [selectedUnit, setSelectedUnit] = useState<string | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);

  useEffect(() => {
    adminFetch<Language[]>("/content/languages").then((langs) => {
      setLanguages(langs);
      if (langs.length && !selectedLang) setSelectedLang(langs[0]!.code);
    });
  }, []);

  useEffect(() => {
    if (!selectedLang) return;
    setSelectedUnit(null);
    setLessons([]);
    adminFetch<Unit[]>(`/content/units?language_code=${selectedLang}`).then(setUnits);
  }, [selectedLang]);

  useEffect(() => {
    if (!selectedUnit) return;
    adminFetch<Lesson[]>(`/content/lessons?unit_id=${selectedUnit}`).then(setLessons);
  }, [selectedUnit]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold">Content</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <section className="card">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold">Languages</h2>
            <NewLanguageButton onCreated={(l) => setLanguages((cur) => [...cur, l])} />
          </div>
          <ul className="space-y-1">
            {languages.map((l) => (
              <li key={l.code}>
                <button
                  onClick={() => setSelectedLang(l.code)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-sm font-bold flex items-center gap-2 ${
                    selectedLang === l.code
                      ? "bg-berkut-primary/10 text-berkut-primary"
                      : "hover:bg-black/5 dark:hover:bg-white/5"
                  }`}
                >
                  <span className="text-lg">{l.flag_emoji}</span>
                  <span className="flex-1">{l.name_en}</span>
                  <span className="text-xs text-berkut-muted dark:text-berkut-muted-dark">
                    {l.code}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </section>

        <section className="card">
          <h2 className="font-bold mb-3">
            Units {selectedLang && <span className="text-berkut-muted dark:text-berkut-muted-dark text-xs">— {selectedLang}</span>}
          </h2>
          <ul className="space-y-1">
            {units.map((u) => (
              <li key={u.id}>
                <button
                  onClick={() => setSelectedUnit(u.id)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-sm font-bold flex items-center gap-2 ${
                    selectedUnit === u.id
                      ? "bg-berkut-primary/10 text-berkut-primary"
                      : "hover:bg-black/5 dark:hover:bg-white/5"
                  }`}
                >
                  <span>{u.emoji}</span>
                  <span className="flex-1 truncate">
                    Unit {u.order}: {u.title_en}
                  </span>
                  <span className="text-xs text-berkut-muted dark:text-berkut-muted-dark">
                    {u.cefr_level}
                  </span>
                </button>
              </li>
            ))}
            {units.length === 0 && (
              <li className="text-sm text-berkut-muted dark:text-berkut-muted-dark px-3 py-2">
                No units for this language.
              </li>
            )}
          </ul>
        </section>

        <section className="card">
          <h2 className="font-bold mb-3">Lessons</h2>
          <ul className="space-y-1">
            {lessons.map((l) => (
              <li key={l.id}>
                <Link
                  to={`/admin/content/lessons/${l.id}`}
                  className="block px-3 py-2 rounded-xl text-sm font-bold hover:bg-black/5 dark:hover:bg-white/5"
                >
                  <span className="text-berkut-muted dark:text-berkut-muted-dark mr-2">
                    {l.order}.
                  </span>
                  {l.title_en}
                  <span className="text-xs text-berkut-muted dark:text-berkut-muted-dark block">
                    {l.title_native}
                  </span>
                </Link>
              </li>
            ))}
            {lessons.length === 0 && selectedUnit && (
              <li className="text-sm text-berkut-muted dark:text-berkut-muted-dark px-3 py-2">
                No lessons.
              </li>
            )}
          </ul>
        </section>
      </div>
    </div>
  );
}

function NewLanguageButton({ onCreated }: { onCreated: (l: Language) => void }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    code: "",
    name_en: "",
    name_native: "",
    flag_emoji: "🌐",
    status: "active",
    sort_order: 100,
  });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="text-xs font-bold text-berkut-primary hover:underline">
        + Add language
      </button>
    );
  }

  return (
    <div className="card absolute z-10 bg-white dark:bg-berkut-card-dark p-3 mt-2 w-72 shadow-xl border-2 border-berkut-primary">
      <div className="space-y-2 text-sm">
        <input placeholder="code (e.g. es)" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toLowerCase() })} className="w-full rounded-lg border-2 border-berkut-border dark:border-berkut-border-dark bg-transparent px-2 py-1 text-sm" />
        <input placeholder="English name" value={form.name_en} onChange={(e) => setForm({ ...form, name_en: e.target.value })} className="w-full rounded-lg border-2 border-berkut-border dark:border-berkut-border-dark bg-transparent px-2 py-1 text-sm" />
        <input placeholder="Native name" value={form.name_native} onChange={(e) => setForm({ ...form, name_native: e.target.value })} className="w-full rounded-lg border-2 border-berkut-border dark:border-berkut-border-dark bg-transparent px-2 py-1 text-sm" />
        <input placeholder="🇰🇿" value={form.flag_emoji} onChange={(e) => setForm({ ...form, flag_emoji: e.target.value })} className="w-full rounded-lg border-2 border-berkut-border dark:border-berkut-border-dark bg-transparent px-2 py-1 text-sm" />
        {err && <p className="text-berkut-error font-bold">{err}</p>}
        <div className="flex gap-2 justify-end">
          <button onClick={() => setOpen(false)} className="text-xs text-berkut-muted dark:text-berkut-muted-dark">Cancel</button>
          <button
            disabled={busy}
            onClick={async () => {
              setBusy(true);
              setErr(null);
              try {
                const created = await adminFetch<Language>("/content/languages", {
                  method: "POST",
                  body: JSON.stringify(form),
                });
                onCreated(created);
                setOpen(false);
              } catch (e: any) {
                setErr(String(e));
              } finally {
                setBusy(false);
              }
            }}
            className="btn-primary text-xs"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}
