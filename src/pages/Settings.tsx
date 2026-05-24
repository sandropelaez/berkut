import { useState } from "react";
import { useStore } from "@/store/useStore";
import { isSupabaseConfigured, getSupabase } from "@/core/supabase";
import { useNavigate } from "react-router-dom";

export default function Settings() {
  const navigate = useNavigate();
  const displayName = useStore((s) => s.displayName);
  const setDisplayName = useStore((s) => s.setDisplayName);
  const scriptPref = useStore((s) => s.scriptPref);
  const setScriptPref = useStore((s) => s.setScriptPref);
  const darkMode = useStore((s) => s.darkMode);
  const setDarkMode = useStore((s) => s.setDarkMode);
  const reset = useStore((s) => s.reset);

  const [name, setName] = useState(displayName);

  async function handleLogout() {
    const sb = getSupabase();
    if (sb) {
      await sb.auth.signOut({ scope: "local" });
    }
    reset();
    try {
      localStorage.removeItem("berkut-store");
    } catch {
      // ignore — private mode / disabled storage
    }
    navigate("/auth/login", { replace: true });
  }

  async function handleDelete() {
    if (!confirm("Type your display name to confirm permanent deletion?")) return;
    const sb = getSupabase();
    if (sb) {
      const { data } = await sb.auth.getSession();
      const accessToken = data.session?.access_token;
      try {
        await fetch("/api/users/me", {
          method: "DELETE",
          headers: { Authorization: `Bearer ${accessToken ?? ""}` },
        });
      } catch {
        // best-effort; localStorage will still be wiped
      }
      await sb.auth.signOut();
    }
    reset();
    navigate("/welcome", { replace: true });
  }

  return (
    <div className="mx-auto max-w-2xl px-4 sm:pl-32 py-6 space-y-5">
      <h1 className="text-2xl font-extrabold mb-2">Settings</h1>

      <section className="card space-y-3">
        <h2 className="font-bold">Profile</h2>
        <label className="block text-sm font-semibold">
          Display name
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={() => setDisplayName(name)}
            className="mt-1 w-full rounded-xl border-2 border-berkut-border dark:border-berkut-border-dark bg-white dark:bg-berkut-card-dark px-3 py-2 outline-none focus:border-berkut-primary"
          />
        </label>
      </section>

      <section className="card space-y-3">
        <h2 className="font-bold">Script</h2>
        <p className="text-sm text-berkut-muted dark:text-berkut-muted-dark">
          Kazakh is transitioning from Cyrillic to Latin. Pick whichever you're learning.
        </p>
        <div className="grid grid-cols-2 gap-3">
          <ScriptToggle
            active={scriptPref === "CYRILLIC"}
            onClick={() => setScriptPref("CYRILLIC")}
            title="Cyrillic"
            sample="Сәлем"
          />
          <ScriptToggle
            active={scriptPref === "LATIN"}
            onClick={() => setScriptPref("LATIN")}
            title="Latin (2021)"
            sample="Sälem"
          />
        </div>
      </section>

      <section className="card space-y-3">
        <h2 className="font-bold">Appearance</h2>
        <Toggle
          checked={darkMode}
          onChange={setDarkMode}
          label="Dark mode"
        />
      </section>

      <section className="card space-y-3">
        <h2 className="font-bold">Account</h2>
        {isSupabaseConfigured() ? (
          <>
            <button onClick={handleLogout} className="btn-outline w-full">
              Log out
            </button>
            <button
              onClick={handleDelete}
              className="btn-error w-full"
            >
              Delete account
            </button>
          </>
        ) : (
          <p className="text-sm text-berkut-muted dark:text-berkut-muted-dark">
            Cloud accounts are disabled. Add Supabase env vars in Vercel to enable
            sign-in and cross-device sync.
          </p>
        )}
        <button
          onClick={() => {
            if (confirm("Reset all local progress? This can't be undone.")) reset();
          }}
          className="btn-outline w-full"
        >
          Reset local progress
        </button>
      </section>
    </div>
  );
}

function ScriptToggle({
  active,
  onClick,
  title,
  sample,
}: {
  active: boolean;
  onClick: () => void;
  title: string;
  sample: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`p-4 rounded-2xl border-2 text-left transition active:scale-[0.99] ${
        active
          ? "border-berkut-primary bg-berkut-primary/10"
          : "border-berkut-border dark:border-berkut-border-dark hover:border-berkut-primary"
      }`}
    >
      <div className="text-xs uppercase tracking-wide text-berkut-muted dark:text-berkut-muted-dark">
        {title}
      </div>
      <div className="text-2xl font-extrabold kk mt-1">{sample}</div>
    </button>
  );
}

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <label className="flex items-center justify-between cursor-pointer">
      <span className="font-semibold">{label}</span>
      <span
        onClick={() => onChange(!checked)}
        className={`relative w-12 h-7 rounded-full transition ${
          checked ? "bg-berkut-primary" : "bg-berkut-border dark:bg-berkut-border-dark"
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform ${
            checked ? "translate-x-5" : ""
          }`}
        />
      </span>
    </label>
  );
}
