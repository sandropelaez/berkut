import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getSupabase } from "@/core/supabase";
import { AuthShell, Banner, Field } from "./Login";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    if (password.length < 10 || !/[A-Za-z]/.test(password) || !/\d/.test(password)) {
      setError("Password must be ≥10 characters with a letter and a digit.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords don't match.");
      return;
    }
    setError(null);
    const sb = getSupabase();
    if (!sb) {
      navigate("/auth/login", { replace: true });
      return;
    }
    setBusy(true);
    const { error } = await sb.auth.updateUser({ password });
    setBusy(false);
    if (error) {
      setError("This link has expired. Request a new one.");
      return;
    }
    navigate("/", { replace: true });
  }

  return (
    <AuthShell title="Set a new password">
      <form onSubmit={submit} className="space-y-3">
        <Field
          label="New password"
          type="password"
          value={password}
          onChange={setPassword}
          required
          helper="At least 10 characters with a letter and a digit"
        />
        <Field
          label="Confirm password"
          type="password"
          value={confirm}
          onChange={setConfirm}
          required
        />
        {error && <Banner tone="error">{error}</Banner>}
        <button type="submit" disabled={busy} className="btn-primary w-full">
          {busy ? "Saving…" : "Update password"}
        </button>
      </form>
    </AuthShell>
  );
}
