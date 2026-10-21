/** @type {import('tailwindcss').Config} */

// Colours come from the Berkut design system tokens, declared as RGB channels
// in src/index.css (light on :root, dark on .dark) so opacity modifiers work.
const v = (name) => `rgb(var(--bk-${name}) / <alpha-value>)`;

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        berkut: {
          surface: v("surface"),
          raised: v("surface-raised"),
          sunk: v("surface-sunk"),
          line: v("line"),
          "line-strong": v("line-strong"),
          ink: v("ink"),
          muted: v("ink-muted"),
          sky: v("sky"),
          "sky-hover": v("sky-hover"),
          "on-sky": v("on-sky"),
          "sky-ink": v("sky-ink"),
          "sky-soft": v("sky-soft"),
          gold: v("gold"),
          "on-gold": v("on-gold"),
          "gold-ink": v("gold-ink"),
          "gold-soft": v("gold-soft"),
          success: v("success"),
          "on-success": v("on-success"),
          "success-soft": v("success-soft"),
          danger: v("danger"),
          "on-danger": v("on-danger"),
          "danger-soft": v("danger-soft"),
          focus: v("focus"),

          // Legacy names, still used by admin screens. Each pair resolves to
          // one theme-aware token, so `x dark:x-dark` stays correct.
          primary: v("sky-ink"),
          "primary-dark": v("sky-ink"),
          error: v("danger"),
          bg: v("surface"),
          "bg-dark": v("surface"),
          card: v("surface-raised"),
          "card-dark": v("surface-raised"),
          border: v("line"),
          "border-dark": v("line"),
          "ink-dark": v("ink"),
          "muted-dark": v("ink-muted"),
        },
      },
      fontFamily: {
        sans: ["Onest", "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
        display: ["Unbounded", "Onest", "system-ui", "sans-serif"],
      },
      // The display face tops out at 600; extrabold maps there instead of a faux bold.
      fontWeight: {
        extrabold: "600",
      },
      borderRadius: {
        tile: "14px",
        sheet: "22px",
      },
      boxShadow: {
        card: "var(--bk-shadow-card)",
        sheet: "var(--bk-shadow-sheet)",
      },
      maxWidth: {
        content: "560px",
      },
      keyframes: {
        pop: {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        shake: {
          "0%,100%": { transform: "translateX(0)" },
          "25%": { transform: "translateX(-6px)" },
          "75%": { transform: "translateX(6px)" },
        },
      },
      animation: {
        pop: "pop 180ms ease-out",
        shake: "shake 240ms ease-in-out",
      },
    },
  },
  plugins: [],
};
