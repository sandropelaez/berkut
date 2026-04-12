"use client";

export function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="22" height="20" viewBox="0 0 22 20" className="inline-block align-middle">
      <path
        d="M11 18.5C11 18.5 1 12.5 1 6.5C1 3.46 3.46 1 6.5 1C8.24 1 9.81 1.81 11 3.08C12.19 1.81 13.76 1 15.5 1C18.54 1 21 3.46 21 6.5C21 12.5 11 18.5 11 18.5Z"
        fill={filled ? "#EF476F" : "none"}
        stroke="#EF476F"
        strokeWidth="1.5"
      />
    </svg>
  );
}

export function StreakIcon() {
  return (
    <svg width="16" height="20" viewBox="0 0 18 22" className="inline-block align-middle">
      <path
        d="M9 0C9 0 12 5 12 9C12 11 11 13 9 14C7 13 6 11 6 9C6 5 9 0 9 0Z M4 10C4 10 6 13 6 16C6 18 5 20 3 21C1 20 0 18 0 16C0 13 4 10 4 10Z M14 10C14 10 12 13 12 16C12 18 13 20 15 21C17 20 18 18 18 16C18 13 14 10 14 10Z"
        fill="#FFB703"
      />
    </svg>
  );
}

export function GemIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" className="inline-block align-middle">
      <polygon points="8,1 14,6 8,15 2,6" fill="#00B4D8" stroke="#0096B7" strokeWidth="0.8" />
      <polygon points="8,1 5,6 8,15" fill="#33C5E3" strokeWidth="0" />
    </svg>
  );
}

export function EagleIcon({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" className="inline-block align-middle">
      <circle cx="20" cy="20" r="18" fill="#00B4D8" opacity="0.12" />
      <text x="20" y="26" textAnchor="middle" fontSize="20">
        🦅
      </text>
    </svg>
  );
}
