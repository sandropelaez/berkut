import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        berkut: {
          sky: "#00B4D8",
          "sky-light": "#e6f7fb",
          "sky-dark": "#0096B7",
          gold: "#FFB703",
          "gold-light": "#fff4d6",
          success: "#06D6A0",
          "success-light": "#e8faf4",
          error: "#EF476F",
          "error-light": "#fde8ee",
          bg: "#F8F9FA",
          dark: "#1A1A2E",
        },
      },
      fontFamily: {
        sans: ['"Noto Sans"', "system-ui", "sans-serif"],
        display: ['"Outfit"', '"Noto Sans"', "system-ui", "sans-serif"],
      },
      keyframes: {
        "confetti-fall": {
          "0%": { transform: "translateY(0) rotate(0deg)", opacity: "1" },
          "100%": {
            transform: "translateY(500px) rotate(720deg)",
            opacity: "0",
          },
        },
        "float-up": {
          "0%": { transform: "translateY(0)", opacity: "1" },
          "100%": { transform: "translateY(-40px)", opacity: "0" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(0,180,216,0.3)" },
          "50%": { boxShadow: "0 0 0 8px rgba(0,180,216,0)" },
        },
        "slide-up": {
          "0%": { transform: "translateY(100%)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "shake": {
          "0%, 100%": { transform: "translateX(0)" },
          "25%": { transform: "translateX(-6px)" },
          "75%": { transform: "translateX(6px)" },
        },
      },
      animation: {
        "confetti-fall": "confetti-fall 1s ease-out forwards",
        "float-up": "float-up 0.8s ease-out forwards",
        "pulse-glow": "pulse-glow 2s infinite",
        "slide-up": "slide-up 0.3s ease-out",
        "shake": "shake 0.3s ease-in-out",
      },
    },
  },
  plugins: [],
};

export default config;
