import { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "@/components/Layout";
import Home from "@/pages/Home";
import LessonPlayer from "@/pages/LessonPlayer";
import LessonComplete from "@/pages/LessonComplete";
import Practice from "@/pages/Practice";
import Leaderboard from "@/pages/Leaderboard";
import Profile from "@/pages/Profile";
import Settings from "@/pages/Settings";
import Welcome from "@/pages/Welcome";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import AuthCallback from "@/pages/auth/Callback";
import VerifyEmail from "@/pages/auth/VerifyEmail";
import ForgotPassword from "@/pages/auth/ForgotPassword";
import ResetPassword from "@/pages/auth/ResetPassword";
import { useStore } from "@/store/useStore";

export default function App() {
  const ensureHeartRegen = useStore((s) => s.ensureHeartRegen);
  const darkMode = useStore((s) => s.darkMode);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  useEffect(() => {
    ensureHeartRegen();
    const id = setInterval(ensureHeartRegen, 60_000);
    return () => clearInterval(id);
  }, [ensureHeartRegen]);

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/lesson/:id" element={<LessonPlayer />} />
        <Route path="/lesson/:id/complete" element={<LessonComplete />} />
        <Route path="/practice" element={<Practice />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/register" element={<Register />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/auth/verify-email" element={<VerifyEmail />} />
        <Route path="/auth/forgot" element={<ForgotPassword />} />
        <Route path="/auth/reset" element={<ResetPassword />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
