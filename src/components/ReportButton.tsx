import { useState } from "react";
import { getSupabase } from "@/core/supabase";

type Reason =
  | "wrong_translation"
  | "grammar_error"
  | "typo"
  | "bad_audio"
  | "too_hard"
  | "too_easy"
  | "offensive"
  | "other";

const REASON_LABELS: Record<Reason, string> = {
  wrong_translation: "Wrong translation",
  grammar_error: "Grammar error",
  typo: "Typo / spelling",
  bad_audio: "Bad audio",
  too_hard: "Too hard for this level",
  too_easy: "Too easy for this level",
  offensive: "Offensive content",
  other: "Other",
};

const REASON_ORDER: Reason[] = [
  "wrong_translation",
  "grammar_error",
  "typo",
  "bad_audio",
  "too_hard",
  "too_easy",
  "offensive",
  "other",
];

// Track reported exercises in-session so users can't re-report the same one.
const reportedThisSession = new Set<string>();

export default function ReportButton({ exerciseId }: { exerciseId: string }) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState<Reason>("wrong_translation");
  const [comment, setComment] = useState("");
  const [busy, setBusy] = useState(false);
  const [state, setState] = useState<"idle" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const alreadyReported = reportedThisSession.has(exerciseId);

  async function submit() {
    if (busy) return;
    setBusy(true);
    setErrorMsg(null);
    try {
      const sb = getSupabase();
      const token = (await sb?.auth.getSession())?.data.session?.access_token;
      const res = await fetch("/api/report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token ?? ""}`,
        },
        body: JSON.stringify({
          exercise_id: exerciseId,
          reason,
          comment: comment.trim() || undefined,
        }),
      });
      if (!res.ok) {
        const body = await res.text();
        throw new Error(`HTTP ${res.status} — ${body.slice(0, 120)}`);
      }
      reportedThisSession.add(exerciseId);
      setState("sent");
      setTimeout(() => setOpen(false), 1400);
    } catch (e: any) {
      setState("error");
      setErrorMsg(e.message ?? "Could not submit.");
    } finally {
      setBusy(false);
    }
  }

  if (alreadyReported && !open) {
    return (
      <span className="text-xs text-berkut-muted dark:text-berkut-muted-dark italic">
        Reported · thanks
      </span>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setOpen(true);
          setState("idle");
          setComment("");
        }}
        className="text-xs text-berkut-muted dark:text-berkut-muted-dark hover:text-berkut-error underline-offset-2 hover:underline"
        title="Report a mistake in this exercise"
      >
        Report a mistake
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/40 flex items-end sm:items-center justify-center px-4 py-6"
          onClick={() => !busy && setOpen(false)}
        >
          <div
            className="bg-white dark:bg-berkut-card-dark rounded-2xl border-2 border-berkut-border dark:border-berkut-border-dark p-5 w-full max-w-md shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {state === "sent" ? (
              <div className="text-center py-4">
                <div className="text-3xl">🙏</div>
                <p className="font-bold mt-2">Thanks! We'll review this.</p>
              </div>
            ) : (
              <>
                <h2 className="text-lg font-extrabold">What's wrong with this exercise?</h2>
                <p className="text-sm text-berkut-muted dark:text-berkut-muted-dark mt-1">
                  Your report helps us improve. Reviewed by Berkut's content team.
                </p>

                <div className="mt-4 space-y-1.5">
                  {REASON_ORDER.map((r) => (
                    <label
                      key={r}
                      className={`flex items-center gap-3 px-3 py-2 rounded-xl border-2 cursor-pointer transition ${
                        reason === r
                          ? "border-berkut-primary bg-berkut-primary/10"
                          : "border-berkut-border dark:border-berkut-border-dark hover:border-berkut-primary"
                      }`}
                    >
                      <input
                        type="radio"
                        name="report-reason"
                        value={r}
                        checked={reason === r}
                        onChange={() => setReason(r)}
                        className="accent-berkut-primary"
                      />
                      <span className="text-sm font-semibold">{REASON_LABELS[r]}</span>
                    </label>
                  ))}
                </div>

                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value.slice(0, 500))}
                  placeholder="Optional details (max 500 chars)"
                  rows={3}
                  className="mt-4 w-full rounded-xl border-2 border-berkut-border dark:border-berkut-border-dark bg-white dark:bg-berkut-card-dark px-3 py-2 outline-none focus:border-berkut-primary text-sm"
                />

                {state === "error" && errorMsg && (
                  <p className="text-sm text-berkut-error font-bold mt-2">{errorMsg}</p>
                )}

                <div className="flex gap-2 justify-end mt-4">
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="btn-outline text-sm"
                    disabled={busy}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={submit}
                    className="btn-primary text-sm"
                    disabled={busy}
                  >
                    {busy ? "Sending…" : "Submit"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
