import { useState, type FormEvent } from "react";
import type { TypeAnswerPrompt } from "@/core/types";
import ScriptText from "@/components/ScriptText";
import { typedMatch } from "@/core/scoring";
import { useStore } from "@/store/useStore";
import { Button } from "@/components/ui";

export default function TypeAnswer({
  prompt,
  phase,
  onAnswer,
}: {
  prompt: TypeAnswerPrompt;
  phase: "answering" | "checked";
  onAnswer: (correct: boolean) => void;
}) {
  const script = useStore((s) => s.scriptPref);
  const [typed, setTyped] = useState("");
  const [grade, setGrade] = useState<ReturnType<typeof typedMatch> | null>(null);
  const [shown, setShown] = useState(prompt.correctAns);

  function check(e: FormEvent) {
    e.preventDefault();
    if (phase !== "answering" || !typed.trim()) return;
    // The best grade against the answer or any phrase that means the same.
    const answers = [prompt.correctAns, ...(prompt.alsoAccepted ?? [])];
    const grades = answers.map((a) => typedMatch(typed, a));
    const g = grades.includes("exact") ? "exact" : grades.includes("close") ? "close" : "wrong";
    setGrade(g);
    setShown(g === "wrong" ? prompt.correctAns : answers[grades.indexOf(g)]!);
    onAnswer(g !== "wrong");
  }

  const showAnswer = phase === "checked" && grade !== "exact";

  return (
    <form className="space-y-6" onSubmit={check}>
      <div className="flex flex-col gap-2">
        <h2 className="text-prompt text-berkut-ink-muted">Type this in Kazakh</h2>
        <p className="text-title-md">{prompt.promptEn}</p>
      </div>

      <input
        lang="kk"
        className={`field !text-option ${
          phase === "checked"
            ? grade === "wrong"
              ? "!shadow-[inset_0_0_0_2px_rgb(var(--bk-danger))]"
              : "!shadow-[inset_0_0_0_2px_rgb(var(--bk-success))]"
            : ""
        }`}
        value={typed}
        onChange={(e) => setTyped(e.target.value)}
        readOnly={phase !== "answering"}
        placeholder={script === "LATIN" ? "Type in Latin or Cyrillic" : "Type in Cyrillic or Latin"}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
        autoFocus
        aria-label="Your answer"
      />

      {showAnswer && (
        <div className="rounded-tile bg-berkut-surface px-5 py-4" role="status">
          <div className="text-small text-berkut-ink-muted">
            {grade === "close" ? "Right! Mind the Kazakh letters:" : "Answer:"}
          </div>
          <div lang="kk" className="text-title-md">
            <ScriptText>{shown}</ScriptText>
          </div>
        </div>
      )}

      {phase === "answering" && (
        <Button type="submit" size="lg" block disabled={!typed.trim()}>
          Check
        </Button>
      )}
    </form>
  );
}
