import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { adminFetch } from "@/admin/api";

interface Lesson {
  id: string;
  unit_id: string;
  order: number;
  title_native: string;
  title_en: string;
  status: string;
}
interface Exercise {
  id: string;
  lesson_id: string;
  order: number;
  type: string;
  prompt: any;
  status: string;
}

export default function AdminLessonEditor() {
  const { id } = useParams();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [showJson, setShowJson] = useState<string | null>(null);

  function load() {
    if (!id) return;
    adminFetch<Lesson>(`/content/lessons/${id}`).then(setLesson);
    adminFetch<Exercise[]>(`/content/exercises?lesson_id=${id}`).then(setExercises);
  }
  useEffect(load, [id]);

  async function saveLesson(updates: Partial<Lesson>) {
    setErr(null);
    try {
      const updated = await adminFetch<Lesson>(`/content/lessons/${id}`, {
        method: "PATCH",
        body: JSON.stringify(updates),
      });
      setLesson(updated);
      setSavedAt(new Date().toLocaleTimeString());
    } catch (e: any) {
      setErr(String(e));
    }
  }

  async function saveExercise(ex: Exercise, prompt: any) {
    setErr(null);
    try {
      await adminFetch(`/content/exercises/${ex.id}`, {
        method: "PATCH",
        body: JSON.stringify({ prompt }),
      });
      load();
      setSavedAt(new Date().toLocaleTimeString());
    } catch (e: any) {
      setErr(String(e));
    }
  }

  async function deleteExercise(ex: Exercise) {
    if (!confirm(`Delete exercise ${ex.id}? This cannot be undone.`)) return;
    await adminFetch(`/content/exercises/${ex.id}`, { method: "DELETE" });
    load();
  }

  if (!lesson) return <div>Loading…</div>;

  return (
    <div className="space-y-6">
      <Link to="/admin/content" className="text-sm text-berkut-primary hover:underline">
        ← Back to content
      </Link>

      <div className="card space-y-3">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-extrabold">Lesson · {lesson.id}</h1>
          {savedAt && (
            <span className="text-xs text-berkut-success font-bold">Saved {savedAt}</span>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field
            label="Title (native)"
            value={lesson.title_native}
            onChange={(v) => setLesson({ ...lesson, title_native: v })}
            onBlur={(v) => saveLesson({ title_native: v })}
          />
          <Field
            label="Title (English)"
            value={lesson.title_en}
            onChange={(v) => setLesson({ ...lesson, title_en: v })}
            onBlur={(v) => saveLesson({ title_en: v })}
          />
        </div>
        {err && <p className="text-berkut-error font-bold text-sm">{err}</p>}
      </div>

      <h2 className="text-lg font-bold">Exercises ({exercises.length})</h2>
      <div className="space-y-3">
        {exercises.map((ex) => (
          <div key={ex.id} className="card">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-wide font-bold text-berkut-muted dark:text-berkut-muted-dark">
                  {ex.order}.
                </span>
                <span className="chip bg-berkut-primary/10 text-berkut-primary text-xs">
                  {ex.type}
                </span>
                <span className="text-xs text-berkut-muted dark:text-berkut-muted-dark">
                  {ex.id}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowJson(showJson === ex.id ? null : ex.id)}
                  className="text-xs text-berkut-primary hover:underline font-bold"
                >
                  {showJson === ex.id ? "Hide JSON" : "Edit JSON"}
                </button>
                <button
                  onClick={() => deleteExercise(ex)}
                  className="text-xs text-berkut-error hover:underline font-bold"
                >
                  Delete
                </button>
              </div>
            </div>
            <pre className="text-xs bg-berkut-bg dark:bg-berkut-bg-dark rounded-lg p-2 overflow-x-auto">
              {JSON.stringify(ex.prompt, null, 2)}
            </pre>
            {showJson === ex.id && (
              <JsonEditor
                value={ex.prompt}
                onSave={(p) => {
                  saveExercise(ex, p);
                  setShowJson(null);
                }}
                onCancel={() => setShowJson(null)}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  onBlur,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  onBlur?: (v: string) => void;
}) {
  return (
    <label className="block text-sm font-semibold">
      {label}
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={(e) => onBlur?.(e.target.value)}
        className="mt-1 w-full rounded-xl border-2 border-berkut-border dark:border-berkut-border-dark bg-white dark:bg-berkut-card-dark px-3 py-2 outline-none focus:border-berkut-primary"
      />
    </label>
  );
}

function JsonEditor({
  value,
  onSave,
  onCancel,
}: {
  value: any;
  onSave: (p: any) => void;
  onCancel: () => void;
}) {
  const [text, setText] = useState(JSON.stringify(value, null, 2));
  const [err, setErr] = useState<string | null>(null);

  return (
    <div className="mt-3 space-y-2">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={12}
        className="w-full font-mono text-xs rounded-lg border-2 border-berkut-border dark:border-berkut-border-dark bg-white dark:bg-berkut-card-dark px-3 py-2"
      />
      {err && <p className="text-berkut-error font-bold text-xs">{err}</p>}
      <div className="flex gap-2 justify-end">
        <button onClick={onCancel} className="btn-outline text-xs">
          Cancel
        </button>
        <button
          onClick={() => {
            try {
              const parsed = JSON.parse(text);
              onSave(parsed);
            } catch (e: any) {
              setErr(`Invalid JSON: ${e.message}`);
            }
          }}
          className="btn-primary text-xs"
        >
          Save
        </button>
      </div>
    </div>
  );
}
