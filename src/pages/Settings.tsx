import { useState } from "react";
import { useStore } from "@/store/useStore";
import { isSupabaseConfigured, getSupabase } from "@/core/supabase";
import { flushProgress, stopProgressSync } from "@/core/progressSync";
import { useNavigate } from "react-router-dom";
import { Button, ChoiceTile, Field } from "@/components/ui";

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
      // Local progress is wiped below; make sure the server has it first.
      const saved = await flushProgress();
      if (
        !saved &&
        !confirm("Some progress hasn't been saved to your account yet (are you offline?). Log out anyway and lose it?")
      ) {
        return;
      }
      stopProgressSync();
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
      stopProgressSync();
      await sb.auth.signOut();
    }
    reset();
    navigate("/welcome", { replace: true });
  }

  return (
    <div className="mx-auto max-w-content px-6 py-6 space-y-6">
      <h1 className="text-title-lg mb-2">Settings</h1>

      <section className="card space-y-4">
        <h2 className="text-title-sm">Profile</h2>
        <Field
          label="Display name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={() => setDisplayName(name)}
        />
      </section>

      <section className="card space-y-4">
        <h2 className="text-title-sm">Script</h2>
        <p className="text-small text-berkut-ink-muted">
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

      <section className="card space-y-4">
        <h2 className="text-title-sm">Appearance</h2>
        <Toggle
          checked={darkMode}
          onChange={setDarkMode}
          label="Dark mode"
        />
      </section>

      <section className="card space-y-3">
        <h2 className="text-title-sm mb-4">Account</h2>
        {isSupabaseConfigured() ? (
          <>
            <Button variant="secondary" block onClick={handleLogout}>
              Log out
            </Button>
            <button onClick={handleDelete} className="btn-danger btn-block">
              Delete account
            </button>
          </>
        ) : (
          <p className="text-small text-berkut-ink-muted">
            Cloud accounts are disabled. Add Supabase env vars in Vercel to enable
            sign-in and cross-device sync.
          </p>
        )}
        <Button
          variant="secondary"
          block
          onClick={() => {
            if (confirm("Reset all local progress? This can't be undone.")) reset();
          }}
        >
          Reset local progress
        </Button>
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
    <ChoiceTile align="start" state={active ? "selected" : "idle"} onClick={onClick} className="!py-4">
      <span className="block text-small font-medium text-berkut-ink-muted">{title}</span>
      <span lang="kk" className="mt-1 block text-title-md">{sample}</span>
    </ChoiceTile>
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
      <span className="text-label">{label}</span>
      <span
        onClick={() => onChange(!checked)}
        className={`relative w-12 h-7 rounded-full transition-colors ${
          checked ? "bg-berkut-turquoise" : "bg-berkut-line"
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
