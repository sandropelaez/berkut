import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getSupabase, isSupabaseConfigured } from "@/core/supabase";
import GoogleButton from "@/components/GoogleButton";
import { AuthShell, Banner, Divider, Field } from "./Login";
import { useStore } from "@/store/useStore";

export default function Register() {
  const navigate = useNavigate();
  const setDisplayName = useStore((s) => s.setDisplayName);
  const setScriptPref = useStore((s) => s.setScriptPref);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [scriptPref, setLocalScript] = useState<"CYRILLIC" | "LATIN">("CYRILLIC");
  const [terms, setTerms] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  function validate(): string | null {
    if (name.trim().length < 2 || name.trim().length > 30)
      return "Display name must be 2–30 characters.";
    if (!/^[A-Za-z0-9 _\-ӘәіңғүұқөһЀ-ӿ]+$/.test(name))
      return "Display name has invalid characters.";
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email))
      return "Enter a valid email address.";
    if (password.length < 10) return "Password must be at least 10 characters.";
    if (!/[A-Za-z]/.test(password) || !/\d/.test(password))
      return "Password must contain a letter and a digit.";
    if (!terms) return "You must accept the Terms and Privacy Policy.";
    return null;
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    const v = validate();
    if (v) {
      setError(v);
      return;
    }
    setError(null);
    setDisplayName(name.trim());
    setScriptPref(scriptPref);

    const sb = getSupabase();
    if (!sb) {
      navigate("/");
      return;
    }

    setBusy(true);
    const { error } = await sb.auth.signUp({
      email: email.toLowerCase(),
      password,
      options: {
        emailRedirectTo: `${location.origin}/auth/callback`,
        data: {
          display_name: name.trim(),
          script_pref: scriptPref,
        },
      },
    });
    setBusy(false);
    if (error) {
      setError("If this email is available, we've sent a confirmation link.");
      return;
    }
    navigate("/auth/verify-email", { replace: true });
  }

  return (
    <AuthShell title="Create your account">
      {!isSupabaseConfigured() && (
        <Banner tone="info">
          Cloud accounts aren't configured yet. You'll be taken to the app — your
          progress will save locally.
        </Banner>
      )}
      <form onSubmit={submit} className="space-y-3">
        <Field
          label="Display name"
          value={name}
          onChange={setName}
          required
          helper="2–30 characters · shown on the leaderboard"
        />
        <Field label="Email" type="email" value={email} onChange={setEmail} required />
        <Field
          label="Password"
          type="password"
          value={password}
          onChange={setPassword}
          required
          helper="At least 10 characters with a letter and a digit"
        />

        <fieldset className="text-sm font-semibold">
          Script preference
          <div className="mt-2 grid grid-cols-2 gap-2">
            {(["CYRILLIC", "LATIN"] as const).map((s) => (
              <button
                type="button"
                key={s}
                onClick={() => setLocalScript(s)}
                className={`px-3 py-2 rounded-xl border-2 font-bold transition ${
                  scriptPref === s
                    ? "border-berkut-primary bg-berkut-primary/10"
                    : "border-berkut-border dark:border-berkut-border-dark"
                }`}
              >
                {s === "CYRILLIC" ? "Cyrillic" : "Latin"}
              </button>
            ))}
          </div>
        </fieldset>

        <label className="flex items-start gap-2 text-sm font-medium">
          <input
            type="checkbox"
            checked={terms}
            onChange={(e) => setTerms(e.target.checked)}
            className="mt-1"
          />
          <span>
            I agree to the{" "}
            <a href="https://berkutai.com/terms" className="text-berkut-primary hover:underline">
              Terms
            </a>{" "}
            and{" "}
            <a href="https://berkutai.com/privacy" className="text-berkut-primary hover:underline">
              Privacy Policy
            </a>
          </span>
        </label>

        {error && <p className="text-sm text-berkut-error font-bold">{error}</p>}

        <button type="submit" disabled={busy} className="btn-primary w-full">
          {busy ? "Creating account…" : "Create account"}
        </button>
      </form>

      <Divider />
      <GoogleButton mode="signup" />

      <div className="text-center text-sm mt-4 text-berkut-muted dark:text-berkut-muted-dark">
        Already have an account?{" "}
        <Link to="/auth/login" className="text-berkut-primary hover:underline font-semibold">
          Sign in
        </Link>
      </div>
    </AuthShell>
  );
}
