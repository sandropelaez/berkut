import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getSupabase, isSupabaseConfigured } from "@/core/supabase";
import GoogleButton from "@/components/GoogleButton";
import { useStore } from "@/store/useStore";
import { Field as InputField, Logo } from "@/components/ui";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? "/";
  const staySignedIn = useStore((s) => s.staySignedIn);
  const setStaySignedIn = useStore((s) => s.setStaySignedIn);
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
        <label className="flex items-center gap-2 text-sm font-medium select-none">
          <input
            type="checkbox"
            checked={staySignedIn}
            onChange={(e) => setStaySignedIn(e.target.checked)}
            className="accent-berkut-turquoise h-4 w-4"
          />
          <span>Stay signed in</span>
          <span className="text-caption text-berkut-ink-muted ml-auto">
            (don't sign me out for 30 days)
          </span>
        </label>

        {error && <p className="text-small font-semibold text-berkut-danger">{error}</p>}
        <button type="submit" disabled={busy} className="btn-primary btn-block">
          {busy ? "Signing in…" : "Sign in"}
        </button>
      </form>

      <Divider />

      <GoogleButton mode="signin" />

      <div className="text-center text-small mt-5 space-y-2">
        <Link to="/auth/forgot" className="block text-berkut-turquoise-ink hover:underline">
          Forgot your password?
        </Link>
        <div className="text-berkut-ink-muted">
          New here?{" "}
          <Link to="/auth/register" className="text-berkut-turquoise-ink hover:underline font-semibold">
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
    <div className="min-h-screen flex items-center justify-center px-6 py-8">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center justify-center mb-8" aria-label="Berkut home">
          <Logo size={40} wordmark />
        </Link>
        <div className="card">
          <h1 className="text-title-md mb-6 text-center">{title}</h1>
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
    <div className="flex flex-col gap-2">
      <InputField
        label={label}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
      />
      {helper && <span className="text-caption text-berkut-ink-muted">{helper}</span>}
    </div>
  );
}

export function Divider() {
  return (
    <div className="flex items-center gap-3 my-5">
      <div className="flex-1 h-px bg-berkut-line" />
      <span className="text-caption text-berkut-ink-muted">or</span>
      <div className="flex-1 h-px bg-berkut-line" />
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
      ? "bg-berkut-success-soft text-berkut-success"
      : tone === "error"
        ? "bg-berkut-danger-soft text-berkut-danger"
        : "bg-berkut-turquoise-soft text-berkut-ink";
  return (
    <div role={tone === "error" ? "alert" : "status"} className={`text-small rounded-tile px-4 py-3 mb-4 ${cls}`}>
      {children}
    </div>
  );
}
