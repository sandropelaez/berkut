import { useState } from "react";
import { getSupabase } from "@/core/supabase";
import { CheckIcon } from "@/components/ui";

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
      <span className="text-[13px] text-berkut-muted whitespace-nowrap">
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
        className="py-3 text-[13px] font-medium text-berkut-muted hover:text-berkut-danger underline-offset-2 hover:underline whitespace-nowrap"
        title="Report a mistake in this exercise"
      >
        Report a mistake
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/40 flex items-end sm:items-center justify-center sm:px-4 sm:py-6 text-berkut-ink"
          onClick={() => !busy && setOpen(false)}
        >
          <div
            className="bg-berkut-raised rounded-t-sheet sm:rounded-sheet p-5 pb-[calc(20px+env(safe-area-inset-bottom))] sm:pb-5 w-full max-w-md shadow-sheet"
            onClick={(e) => e.stopPropagation()}
          >
            {state === "sent" ? (
              <div className="text-center py-4">
                <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-berkut-success text-berkut-on-success"><CheckIcon /></span>
                <p className="font-bold mt-3">Thanks! We'll review this.</p>
              </div>
            ) : (
              <>
                <h2 className="text-lg leading-6">What's wrong with this exercise?</h2>
                <p className="text-sm text-berkut-muted dark:text-berkut-muted-dark mt-1">
                  Your report helps us improve. Reviewed by Berkut's content team.
                </p>

                <div className="mt-4 space-y-1.5">
                  {REASON_ORDER.map((r) => (
                    <label
                      key={r}
                      className={`flex items-center gap-3 px-3 py-2 rounded-xl border-2 cursor-pointer transition ${
                        reason === r
                          ? "border-berkut-sky-ink bg-berkut-sky-soft"
                          : "border-berkut-line-strong hover:border-berkut-sky-ink"
                      }`}
                    >
                      <input
                        type="radio"
                        name="report-reason"
                        value={r}
                        checked={reason === r}
                        onChange={() => setReason(r)}
                        className="accent-berkut-sky-ink"
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
                  className="mt-4 field py-3 text-sm"
                />

                {state === "error" && errorMsg && (
                  <p className="text-sm text-berkut-danger font-bold mt-2">{errorMsg}</p>
                )}

                <div className="flex gap-2 justify-end mt-4">
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="btn-secondary btn-sm"
                    disabled={busy}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={submit}
                    className="btn-primary btn-sm"
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
