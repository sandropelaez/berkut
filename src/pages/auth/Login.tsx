import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getSupabase, isSupabaseConfigured } from "@/core/supabase";
import GoogleButton from "@/components/GoogleButton";
import { useStore } from "@/store/useStore";
import { SunMark } from "@/components/ui";

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
            className="accent-berkut-primary h-4 w-4"
          />
          <span>Stay signed in</span>
          <span className="text-xs text-berkut-muted dark:text-berkut-muted-dark ml-auto">
            (don't sign me out for 30 days)
          </span>
        </label>

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
        <Link to="/" className="flex items-center justify-center gap-2.5 mb-6">
          <SunMark size={36} />
          <span className="font-display font-semibold text-xl tracking-tight">Berkut</span>
        </Link>
        <div className="card">
          <h1 className="text-[22px] leading-7 mb-5 text-center">{title}</h1>
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
    <label className="flex flex-col gap-1.5 text-sm font-semibold">
      {label}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="field font-normal"
      />
      {helper && (
        <span className="block font-medium text-[13px] text-berkut-muted">
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
      ? "bg-berkut-success-soft text-berkut-success"
      : tone === "error"
        ? "bg-berkut-danger-soft text-berkut-danger"
        : "bg-berkut-gold-soft text-berkut-ink";
  return (
    <div role={tone === "error" ? "alert" : "status"} className={`text-sm font-medium rounded-tile px-4 py-3 mb-4 ${cls}`}>
      {children}
    </div>
  );
}
