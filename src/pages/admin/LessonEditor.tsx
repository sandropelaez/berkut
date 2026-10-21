import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { adminFetch } from "@/admin/api";
import { Card, Field, StatusBadge } from "@/components/ui";

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

  if (!lesson) return <p className="text-small text-berkut-ink-muted">Loading…</p>;

  return (
    <div className="space-y-6">
      <Link to="/admin/content" className="text-small font-semibold text-berkut-turquoise-ink hover:underline">
        Back to content
      </Link>

      <Card className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h1 className="text-title-md">Lesson {lesson.id}</h1>
          {savedAt && <StatusBadge tone="success" icon="check">Saved {savedAt}</StatusBadge>}
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field
            label="Title (native)"
            lang="kk"
            value={lesson.title_native}
            onChange={(e) => setLesson({ ...lesson, title_native: e.target.value })}
            onBlur={(e) => saveLesson({ title_native: e.target.value })}
          />
          <Field
            label="Title (English)"
            value={lesson.title_en}
            onChange={(e) => setLesson({ ...lesson, title_en: e.target.value })}
            onBlur={(e) => saveLesson({ title_en: e.target.value })}
          />
        </div>
        {err && <p className="text-small font-semibold text-berkut-danger">{err}</p>}
      </Card>

      <h2 className="text-title-sm">Exercises ({exercises.length})</h2>
      <div className="space-y-3">
        {exercises.map((ex) => (
          <Card key={ex.id} className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-small font-semibold tabular-nums text-berkut-ink-muted">{ex.order}.</span>
                <StatusBadge tone="info">{ex.type}</StatusBadge>
                <span className="text-caption text-berkut-ink-muted">{ex.id}</span>
              </div>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setShowJson(showJson === ex.id ? null : ex.id)}
                  className="text-small font-semibold text-berkut-turquoise-ink hover:underline"
                >
                  {showJson === ex.id ? "Hide JSON" : "Edit JSON"}
                </button>
                <button
                  type="button"
                  onClick={() => deleteExercise(ex)}
                  className="text-small font-semibold text-berkut-danger hover:underline"
                >
                  Delete
                </button>
              </div>
            </div>
            <pre className="overflow-x-auto rounded-xl bg-berkut-surface p-3 text-xs">{JSON.stringify(ex.prompt, null, 2)}</pre>
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
          </Card>
        ))}
      </div>
    </div>
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
    <div className="space-y-3">
      <textarea
        aria-label="Exercise JSON"
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={12}
        className="field py-3 font-mono text-xs leading-5"
      />
      {err && <p className="text-small font-semibold text-berkut-danger">{err}</p>}
      <div className="flex justify-end gap-2">
        <button type="button" onClick={onCancel} className="btn-secondary btn-sm">
          Cancel
        </button>
        <button
          type="button"
          onClick={() => {
            try {
              onSave(JSON.parse(text));
            } catch (e: any) {
              setErr(`Invalid JSON: ${e.message}`);
            }
          }}
          className="btn-primary btn-sm"
        >
          Save
        </button>
      </div>
    </div>
  );
}
