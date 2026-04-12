"use client";

import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import BottomTabs from "@/components/BottomTabs";

export default function SettingsPage() {
  const router = useRouter();
  const store = useStore();

  return (
    <div className="pb-24 min-h-screen">
      <header className="sticky top-0 z-30 bg-white border-b border-gray-100 px-5 py-3 flex items-center gap-3">
        <button
          onClick={() => router.push("/profile")}
          className="text-xl text-gray-400 hover:text-gray-600"
        >
          ←
        </button>
        <h1 className="text-lg font-semibold flex-1 text-center">Settings</h1>
        <div className="w-7" />
      </header>

      <div className="px-5 py-6 space-y-4">
        {/* Script */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <h3 className="font-semibold mb-4">Script Preference</h3>
          <div className="flex gap-3">
            {(["CYRILLIC", "LATIN"] as const).map((s) => (
              <button
                key={s}
                onClick={() => {
                  store.setScript(s);
                  if (Object.keys(store.completedLessons).length > 0) {
                    store.awardBadge("script_switcher");
                  }
                }}
                className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all border-2 ${
                  store.scriptPref === s
                    ? "bg-berkut-sky text-white border-berkut-sky"
                    : "bg-white text-gray-400 border-gray-200 hover:border-gray-300"
                }`}
              >
                {s === "CYRILLIC" ? "Кириллица" : "Latyn"}
              </button>
            ))}
          </div>
        </div>

        {/* Account */}
        <div className="bg-white rounded-2xl p-5 shadow-sm space-y-2">
          <h3 className="font-semibold mb-2">Account</h3>
          <p className="text-gray-500 text-sm">Username: {store.username}</p>
          <p className="text-gray-500 text-sm">Script: {store.scriptPref}</p>
          <p className="text-gray-500 text-sm">Total XP: {store.xpTotal}</p>
        </div>

        {/* About */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <h3 className="font-semibold mb-2">About Berkut</h3>
          <p className="text-gray-500 text-sm leading-relaxed">
            Berkut (&quot;Golden Eagle&quot;) is a gamified Kazakh language learning app.
            Version 1.0 MVP. Built with dual-script support for both Cyrillic and the
            new Latin alphabet adopted by Kazakhstan.
          </p>
        </div>
      </div>

      <BottomTabs />
    </div>
  );
}
