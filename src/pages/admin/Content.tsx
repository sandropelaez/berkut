import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { adminFetch } from "@/admin/api";
import { Card, Field } from "@/components/ui";

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
      <h1 className="text-title-lg">Content</h1>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="relative">
          <div className="mb-3 flex items-center justify-between gap-2">
            <h2 className="text-title-sm">Languages</h2>
            <NewLanguageButton onCreated={(l) => setLanguages((cur) => [...cur, l])} />
          </div>
          <ul className="space-y-1">
            {languages.map((l) => (
              <li key={l.code}>
                <PickRow selected={selectedLang === l.code} onClick={() => setSelectedLang(l.code)}>
                  <span className="flex-1">{l.name_en}</span>
                  <span className="text-caption text-berkut-ink-muted">{l.code}</span>
                </PickRow>
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <h2 className="mb-3 text-title-sm">
            Units {selectedLang && <span className="text-small text-berkut-ink-muted">· {selectedLang}</span>}
          </h2>
          <ul className="space-y-1">
            {units.map((u) => (
              <li key={u.id}>
                <PickRow selected={selectedUnit === u.id} onClick={() => setSelectedUnit(u.id)}>
                  <span className="flex-1 truncate">
                    Unit {u.order}: {u.title_en}
                  </span>
                  <span className="text-caption text-berkut-ink-muted">{u.cefr_level}</span>
                </PickRow>
              </li>
            ))}
            {units.length === 0 && <li className="px-4 py-2 text-small text-berkut-ink-muted">No units for this language.</li>}
          </ul>
        </Card>

        <Card>
          <h2 className="mb-3 text-title-sm">Lessons</h2>
          <ul className="space-y-1">
            {lessons.map((l) => (
              <li key={l.id}>
                <Link
                  to={`/admin/content/lessons/${l.id}`}
                  className="block rounded-xl px-4 py-2 text-[15px] font-semibold leading-[22px] hover:bg-berkut-surface"
                >
                  <span className="mr-2 tabular-nums text-berkut-ink-muted">{l.order}.</span>
                  {l.title_en}
                  <span lang="kk" className="block text-caption font-normal text-berkut-ink-muted">
                    {l.title_native}
                  </span>
                </Link>
              </li>
            ))}
            {lessons.length === 0 && selectedUnit && <li className="px-4 py-2 text-small text-berkut-ink-muted">No lessons.</li>}
            {!selectedUnit && <li className="px-4 py-2 text-small text-berkut-ink-muted">Pick a unit.</li>}
          </ul>
        </Card>
      </div>
    </div>
  );
}

function PickRow({ selected, onClick, children }: { selected: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`flex w-full items-center gap-2 rounded-xl px-4 py-2 text-left text-[15px] font-semibold leading-[22px] transition-colors ${
        selected ? "bg-berkut-turquoise-soft text-berkut-turquoise-ink" : "hover:bg-berkut-surface"
      }`}
    >
      {children}
    </button>
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
      <button type="button" onClick={() => setOpen(true)} className="text-small font-semibold text-berkut-turquoise-ink hover:underline">
        Add language
      </button>
    );
  }

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [key]: key === "code" ? e.target.value.toLowerCase() : e.target.value });

  return (
    <div className="absolute left-4 right-4 top-16 z-10 space-y-3 rounded-sheet bg-berkut-surface-raised p-5 shadow-sheet">
      <h3 className="text-title-sm">New language</h3>
      <Field label="Code" placeholder="es" value={form.code} onChange={set("code")} />
      <Field label="English name" value={form.name_en} onChange={set("name_en")} />
      <Field label="Native name" value={form.name_native} onChange={set("name_native")} />
      <Field label="Flag (stored with the language)" value={form.flag_emoji} onChange={set("flag_emoji")} />
      {err && <p className="text-small font-semibold text-berkut-danger">{err}</p>}
      <div className="flex justify-end gap-2">
        <button type="button" onClick={() => setOpen(false)} className="btn-secondary btn-sm">
          Cancel
        </button>
        <button
          type="button"
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
          className="btn-primary btn-sm"
        >
          Create
        </button>
      </div>
    </div>
  );
}
