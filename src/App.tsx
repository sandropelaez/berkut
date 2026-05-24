import { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "@/components/Layout";
import RequireAuth from "@/components/RequireAuth";
import RedirectIfAuthed from "@/components/RedirectIfAuthed";
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
        {/* Public — pre-auth */}
        <Route path="/welcome" element={<Welcome />} />
        <Route
          path="/auth/login"
          element={
            <RedirectIfAuthed>
              <Login />
            </RedirectIfAuthed>
          }
        />
        <Route
          path="/auth/register"
          element={
            <RedirectIfAuthed>
              <Register />
            </RedirectIfAuthed>
          }
        />
        <Route
          path="/auth/forgot"
          element={
            <RedirectIfAuthed>
              <ForgotPassword />
            </RedirectIfAuthed>
          }
        />
        {/* Mid-flow auth pages — must run with or without an existing session */}
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/auth/verify-email" element={<VerifyEmail />} />
        <Route path="/auth/reset" element={<ResetPassword />} />

        {/* Protected — require signed-in session */}
        <Route
          path="/"
          element={
            <RequireAuth>
              <Home />
            </RequireAuth>
          }
        />
        <Route
          path="/lesson/:id"
          element={
            <RequireAuth>
              <LessonPlayer />
            </RequireAuth>
          }
        />
        <Route
          path="/lesson/:id/complete"
          element={
            <RequireAuth>
              <LessonComplete />
            </RequireAuth>
          }
        />
        <Route
          path="/practice"
          element={
            <RequireAuth>
              <Practice />
            </RequireAuth>
          }
        />
        <Route
          path="/leaderboard"
          element={
            <RequireAuth>
              <Leaderboard />
            </RequireAuth>
          }
        />
        <Route
          path="/profile"
          element={
            <RequireAuth>
              <Profile />
            </RequireAuth>
          }
        />
        <Route
          path="/settings"
          element={
            <RequireAuth>
              <Settings />
            </RequireAuth>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
