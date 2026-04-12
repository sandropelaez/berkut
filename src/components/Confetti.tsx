"use client";

const COLORS = ["#00B4D8", "#FFB703", "#06D6A0", "#FF6B6B", "#C084FC"];

export default function Confetti() {
  return (
    <div className="fixed inset-0 pointer-events-none z-[100]">
      {Array.from({ length: 24 }).map((_, i) => (
        <div
          key={i}
          className="absolute -top-2 animate-confetti-fall"
          style={{
            left: `${Math.random() * 100}%`,
            width: `${7 + Math.random() * 7}px`,
            height: `${7 + Math.random() * 7}px`,
            background: COLORS[i % 5],
            borderRadius: Math.random() > 0.5 ? "50%" : "2px",
            animationDuration: `${0.7 + Math.random() * 0.5}s`,
            animationDelay: `${Math.random() * 0.25}s`,
          }}
        />
      ))}
    </div>
  );
}
