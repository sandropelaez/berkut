/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        berkut: {
          primary: "#00B4D8",
          "primary-dark": "#0096B7",
          gold: "#FFB703",
          success: "#06D6A0",
          error: "#EF476F",
          bg: "#F8F9FA",
          "bg-dark": "#1A1A2E",
          card: "#FFFFFF",
          "card-dark": "#23234A",
          border: "#E5E7EB",
          "border-dark": "#33335E",
          ink: "#1A1A2E",
          "ink-dark": "#F8F9FA",
          muted: "#6B7280",
          "muted-dark": "#9CA3AF",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "Noto Sans",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],
      },
      keyframes: {
        pop: {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        floatUp: {
          "0%": { transform: "translateY(0)", opacity: "1" },
          "100%": { transform: "translateY(-40px)", opacity: "0" },
        },
        shake: {
          "0%,100%": { transform: "translateX(0)" },
          "25%": { transform: "translateX(-6px)" },
          "75%": { transform: "translateX(6px)" },
        },
      },
      animation: {
        pop: "pop 180ms ease-out",
        floatUp: "floatUp 900ms ease-out forwards",
        shake: "shake 240ms ease-in-out",
      },
    },
  },
  plugins: [],
};
