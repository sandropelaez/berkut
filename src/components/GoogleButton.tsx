import { getSupabase, isSupabaseConfigured } from "@/core/supabase";

export default function GoogleButton({ mode }: { mode: "signin" | "signup" }) {
  async function handleClick() {
    const sb = getSupabase();
    if (!sb) {
      alert("Cloud accounts not configured.");
      return;
    }
    const { error } = await sb.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${location.origin}/auth/callback`,
        queryParams: { access_type: "offline", prompt: "consent" },
      },
    });
    if (error) alert(error.message);
  }

  if (!isSupabaseConfigured()) return null;

  return (
    <button onClick={handleClick} className="btn-outline w-full flex items-center gap-3">
      <svg viewBox="0 0 48 48" className="h-5 w-5" aria-hidden>
        <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6 8-11.3 8a12 12 0 1 1 0-24 11.9 11.9 0 0 1 8.5 3.5l5.7-5.7A20 20 0 1 0 24 44c11 0 20-9 20-20 0-1.3-.1-2.6-.4-3.5z" />
        <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8A12 12 0 0 1 24 12a12 12 0 0 1 8.5 3.5l5.7-5.7A20 20 0 0 0 6.3 14.7z" />
        <path fill="#4CAF50" d="M24 44c5.2 0 10-2 13.6-5.3l-6.3-5.3A12 12 0 0 1 12.7 28L6 33.2A20 20 0 0 0 24 44z" />
        <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3a12 12 0 0 1-4 5.4l6.3 5.3C42.6 35.4 44 30 44 24c0-1.3-.1-2.6-.4-3.5z" />
      </svg>
      <span>{mode === "signup" ? "Sign up with Google" : "Continue with Google"}</span>
    </button>
  );
}
