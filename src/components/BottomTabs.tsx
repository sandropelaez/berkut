"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/", label: "Learn", icon: "🏠" },
  { href: "/practice", label: "Practice", icon: "🔄" },
  { href: "/leaderboard", label: "Ranks", icon: "🏆" },
  { href: "/profile", label: "Profile", icon: "👤" },
];

export default function BottomTabs() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-white border-t border-gray-100 z-50 flex">
      {tabs.map((t) => {
        const active = t.href === "/" ? pathname === "/" : pathname.startsWith(t.href);
        return (
          <Link
            key={t.href}
            href={t.href}
            className={`flex-1 flex flex-col items-center py-2.5 pb-2 text-[11px] transition-colors ${
              active ? "text-berkut-sky font-semibold" : "text-gray-400 font-normal"
            }`}
          >
            <span className="text-xl mb-0.5">{t.icon}</span>
            {t.label}
          </Link>
        );
      })}
    </nav>
  );
}
