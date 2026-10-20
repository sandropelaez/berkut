import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useContentStore } from "@/store/useContentStore";
import { useStore } from "@/store/useStore";
import ExerciseSession from "@/components/ExerciseSession";
import type { Lesson } from "@/core/types";
import { SunLoader } from "@/components/ui";

export default function LessonPlayer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const loadLesson = useContentStore((s) => s.loadLesson);

  const ensureSrs = useStore((s) => s.ensureSrs);
  const recordLesson = useStore((s) => s.recordLesson);
  const recordExerciseResult = useStore((s) => s.recordExerciseResult);
  const bumpStreak = useStore((s) => s.bumpStreak);

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    loadLesson(id).then((l) => {
      if (cancelled) return;
      if (!l) {
        setLoadError(true);
        return;
      }
      setLesson(l);
      ensureSrs(l.vocab.map((v) => v.id));
    });
    return () => {
      cancelled = true;
    };
  }, [id, loadLesson, ensureSrs]);

  if (loadError) {
    return (
      <div className="px-4 py-10 text-center">
        <h1 className="text-xl">Lesson not found.</h1>
        <Link to="/" className="btn-primary mt-4 inline-flex">
          Back home
        </Link>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <SunLoader label="Loading lesson…" />
      </div>
    );
  }

  function finish(mistakes: number) {
    const perfect = mistakes === 0;
    const result = recordLesson(lesson!.id, perfect);
    const newDay = bumpStreak();
    navigate(`/lesson/${lesson!.id}/complete`, {
      replace: true,
      state: {
        mistakes,
        perfect,
        firstCompletion: result.firstCompletion,
        newStreakDay: newDay,
      },
    });
  }

  return (
    <ExerciseSession
      key={lesson.id}
      exercises={lesson.exercises}
      onResult={(e, correct) => recordExerciseResult(e.id, lesson.id, correct)}
      onFinish={finish}
      onQuit={() => navigate("/")}
    />
  );
}
