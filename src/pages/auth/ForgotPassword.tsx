import { useState } from "react";
import { Link } from "react-router-dom";
import { getSupabase } from "@/core/supabase";
import { AuthShell, Banner, Field } from "./Login";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    const sb = getSupabase();
    if (sb) {
      await sb.auth.resetPasswordForEmail(email.toLowerCase(), {
        redirectTo: `${location.origin}/auth/reset`,
      });
    }
    setBusy(false);
    setSubmitted(true);
  }

  return (
    <AuthShell title="Forgot password">
      {submitted ? (
        <Banner tone="success">
          If an account exists for that email, we've sent a reset link. The link
          is valid for 1 hour.
        </Banner>
      ) : (
        <form onSubmit={submit} className="space-y-3">
          <Field label="Email" type="email" value={email} onChange={setEmail} required />
          <button type="submit" disabled={busy} className="btn-primary w-full">
            {busy ? "Sending…" : "Send reset link"}
          </button>
        </form>
      )}
      <Link to="/auth/login" className="block text-center text-sm text-berkut-primary hover:underline mt-4">
        Back to sign in
      </Link>
    </AuthShell>
  );
}
