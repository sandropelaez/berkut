import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getSupabase } from "@/core/supabase";
import { AuthShell, Banner } from "./Login";

export default function VerifyEmail() {
  const navigate = useNavigate();
  const [seconds, setSeconds] = useState(60);
  const [resendInfo, setResendInfo] = useState<string | null>(null);

  useEffect(() => {
    const sb = getSupabase();
    if (!sb) {
      navigate("/", { replace: true });
      return;
    }
    const id = setInterval(async () => {
      const { data } = await sb.auth.getUser();
      if (data.user?.email_confirmed_at) {
        clearInterval(id);
        navigate("/", { replace: true });
      }
    }, 5000);
    return () => clearInterval(id);
  }, [navigate]);

  useEffect(() => {
    if (seconds <= 0) return;
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds]);

  async function resend() {
    const sb = getSupabase();
    if (!sb) return;
    const { data } = await sb.auth.getUser();
    const email = data.user?.email;
    if (!email) return;
    await sb.auth.resend({ type: "signup", email });
    setSeconds(60);
    setResendInfo("Verification email re-sent.");
  }

  return (
    <AuthShell title="Check your email">
      <p className="text-sm text-berkut-muted dark:text-berkut-muted-dark mb-4">
        We just sent you a verification link. Click it on this device to finish
        creating your account. This page checks every few seconds and will
        redirect once you're verified.
      </p>
      {resendInfo && <Banner tone="success">{resendInfo}</Banner>}
      <button
        onClick={resend}
        disabled={seconds > 0}
        className="btn-outline w-full"
      >
        {seconds > 0 ? `Resend in ${seconds}s` : "Resend verification email"}
      </button>
      <p className="mt-4 text-xs text-berkut-muted dark:text-berkut-muted-dark text-center">
        Didn't receive it? Check your spam folder.
      </p>
    </AuthShell>
  );
}
