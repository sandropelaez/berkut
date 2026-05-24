import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getSupabase, isSupabaseConfigured } from "@/core/supabase";
import GoogleButton from "@/components/GoogleButton";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? "/";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    setError(null);

    const sb = getSupabase();
    if (!sb) {
      navigate(from, { replace: true });
      return;
    }
    setBusy(true);
    const { error } = await sb.auth.signInWithPassword({ email: email.toLowerCase(), password });
    setBusy(false);
    if (error) {
      if (/rate|too many/i.test(error.message)) {
        setError("Too many attempts. Try again in 15 minutes or reset your password.");
      } else {
        setError("Email or password is incorrect");
      }
      return;
    }
    navigate(from, { replace: true });
  }

  return (
    <AuthShell title="Welcome back">
      {!isSupabaseConfigured() && (
        <Banner tone="info">
          Cloud accounts aren't configured. You can still use the app — progress
          stays on this device until env vars are added.
        </Banner>
      )}
      <form onSubmit={submit} className="space-y-3">
        <Field label="Email" type="email" value={email} onChange={setEmail} required />
        <Field
          label="Password"
          type="password"
          value={password}
          onChange={setPassword}
          required
        />
        {error && <p className="text-sm text-berkut-error font-bold">{error}</p>}
        <button type="submit" disabled={busy} className="btn-primary w-full">
          {busy ? "Signing in…" : "Sign in"}
        </button>
      </form>

      <Divider />

      <GoogleButton mode="signin" />

      <div className="text-center text-sm mt-4 space-y-1">
        <Link to="/auth/forgot" className="block text-berkut-primary hover:underline">
          Forgot your password?
        </Link>
        <div className="text-berkut-muted dark:text-berkut-muted-dark">
          New here?{" "}
          <Link to="/auth/register" className="text-berkut-primary hover:underline font-semibold">
            Create an account
          </Link>
        </div>
      </div>
    </AuthShell>
  );
}

export function AuthShell({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center justify-center gap-2 font-extrabold text-xl mb-6">
          <span className="text-2xl">🦅</span> Berkut
        </Link>
        <div className="card">
          <h1 className="text-2xl font-extrabold mb-4 text-center">{title}</h1>
          {children}
        </div>
      </div>
    </div>
  );
}

export function Field({
  label,
  type = "text",
  value,
  onChange,
  required,
  helper,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  helper?: string;
}) {
  return (
    <label className="block text-sm font-semibold">
      {label}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="mt-1 w-full rounded-xl border-2 border-berkut-border dark:border-berkut-border-dark bg-white dark:bg-berkut-card-dark px-3 py-2 outline-none focus:border-berkut-primary"
      />
      {helper && (
        <span className="block mt-1 font-normal text-xs text-berkut-muted dark:text-berkut-muted-dark">
          {helper}
        </span>
      )}
    </label>
  );
}

export function Divider() {
  return (
    <div className="flex items-center gap-3 my-5">
      <div className="flex-1 h-px bg-berkut-border dark:bg-berkut-border-dark" />
      <span className="text-xs uppercase font-bold text-berkut-muted dark:text-berkut-muted-dark">
        or
      </span>
      <div className="flex-1 h-px bg-berkut-border dark:bg-berkut-border-dark" />
    </div>
  );
}

export function Banner({
  children,
  tone = "info",
}: {
  children: React.ReactNode;
  tone?: "info" | "success" | "error";
}) {
  const cls =
    tone === "success"
      ? "bg-berkut-success/10 border-berkut-success text-emerald-800 dark:text-emerald-200"
      : tone === "error"
        ? "bg-berkut-error/10 border-berkut-error text-rose-800 dark:text-rose-200"
        : "bg-berkut-gold/10 border-berkut-gold text-amber-900 dark:text-amber-100";
  return (
    <div className={`text-sm border rounded-xl px-3 py-2 mb-4 ${cls}`}>
      {children}
    </div>
  );
}
