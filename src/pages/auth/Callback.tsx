import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getSupabase } from "@/core/supabase";

export default function AuthCallback() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const sb = getSupabase();
    if (!sb) {
      navigate("/", { replace: true });
      return;
    }
    let cancelled = false;
    (async () => {
      // detectSessionInUrl is enabled, so Supabase parses the URL automatically.
      // We just wait for the session to be established.
      const { data, error } = await sb.auth.getSession();
      if (cancelled) return;
      if (error) {
        setError(error.message);
        return;
      }
      if (data.session) {
        navigate("/", { replace: true });
      } else {
        setError("Sign-in could not be completed. Please try again.");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center px-6 text-center">
      {error ? (
        <div className="max-w-md">
          <h1 className="text-xl font-extrabold text-berkut-error">Sign-in failed</h1>
          <p className="text-berkut-muted dark:text-berkut-muted-dark mt-2">{error}</p>
          <button
            onClick={() => navigate("/auth/login")}
            className="btn-primary mt-6"
          >
            Try again
          </button>
        </div>
      ) : (
        <div>
          <div className="text-4xl">⏳</div>
          <p className="mt-2 font-bold">Signing you in…</p>
        </div>
      )}
    </div>
  );
}
