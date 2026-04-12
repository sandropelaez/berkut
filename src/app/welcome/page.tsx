"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import type { Script } from "@/lib/transliterate";

export default function WelcomePage() {
  const router = useRouter();
  const store = useStore();
  const [name, setName] = useState("");
  const [script, setScript] = useState<Script>("CYRILLIC");

  const handleStart = () => {
    if (!name.trim()) return;
    store.setUsername(name.trim());
    store.setScript(script);
    store.setOnboarded();
    router.replace("/");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-10 text-center bg-gradient-to-b from-berkut-sky/5 via-berkut-gold/5 to-transparent kazakh-ornament">
      {/* Logo */}
      <div className="mb-8">
        <div className="w-28 h-28 mx-auto rounded-full bg-berkut-sky/10 flex items-center justify-center relative">
          <div className="w-20 h-20 rounded-full bg-berkut-sky/15 flex items-center justify-center">
            <span className="text-5xl">🦅</span>
          </div>
        </div>
      </div>

      <h1 className="text-4xl font-extrabold text-berkut-dark tracking-tight font-display">
        Berkut
      </h1>
      <p className="text-lg text-gray-500 mt-1">Learn Kazakh the fun way</p>
      <p className="text-sm text-gray-400 mt-2 leading-relaxed max-w-[280px]">
        Bite-sized lessons, cultural immersion, and dual-script support (Cyrillic & Latin)
      </p>

      {/* Username */}
      <div className="w-full max-w-xs mt-8">
        <input
          type="text"
          placeholder="Choose a username"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-5 py-3.5 rounded-2xl border-2 border-gray-200 text-base outline-none focus:border-berkut-sky transition-colors bg-white font-sans"
          maxLength={24}
        />
      </div>

      {/* Script selector */}
      <div className="w-full max-w-xs mt-5">
        <p className="text-sm text-gray-500 mb-2 text-left">Choose your script:</p>
        <div className="flex gap-3">
          {(["CYRILLIC", "LATIN"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setScript(s)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all border-2 ${
                script === s
                  ? "bg-berkut-sky text-white border-berkut-sky"
                  : "bg-white text-gray-400 border-gray-200 hover:border-gray-300"
              }`}
            >
              {s === "CYRILLIC" ? "Кириллица" : "Latyn"}
              <span className="block text-[11px] font-normal opacity-70">
                {s === "CYRILLIC" ? "(Cyrillic)" : "(Latin)"}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Start button */}
      <button
        onClick={handleStart}
        disabled={!name.trim()}
        className={`w-full max-w-xs mt-8 py-4 rounded-2xl text-lg font-bold text-white transition-all ${
          name.trim()
            ? "bg-berkut-sky hover:bg-berkut-sky-dark active:scale-[0.98] shadow-lg shadow-berkut-sky/25"
            : "bg-gray-300 cursor-not-allowed"
        }`}
      >
        Start Learning
      </button>
    </div>
  );
}
