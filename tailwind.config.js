/** @type {import('tailwindcss').Config} */

// Colours come from the Berkut design system tokens (Turquoise Sky), declared as
// RGB channels in src/index.css (Day on :root, Night on .dark) so opacity modifiers work.
const v = (name) => `rgb(var(--bk-${name}) / <alpha-value>)`;

// Type styles from the system's tokens.json: [size, { lineHeight, fontWeight, letterSpacing }].
const type = (size, lineHeight, fontWeight, letterSpacing = "0") => [size, { lineHeight, fontWeight, letterSpacing }];

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        berkut: {
          bg: v("bg"),
          surface: v("surface"),
          "surface-raised": v("surface-raised"),
          line: v("line"),
          ink: v("ink"),
          "ink-muted": v("ink-muted"),
          turquoise: v("turquoise"),
          "turquoise-hover": v("turquoise-hover"),
          "on-turquoise": v("on-turquoise"),
          "turquoise-ink": v("turquoise-ink"),
          "turquoise-soft": v("turquoise-soft"),
          sun: v("sun"),
          "on-sun": v("on-sun"),
          "sun-ink": v("sun-ink"),
          "sun-soft": v("sun-soft"),
          success: v("success"),
          "on-success": v("on-success"),
          "success-soft": v("success-soft"),
          danger: v("danger"),
          "on-danger": v("on-danger"),
          "danger-soft": v("danger-soft"),
          warning: v("warning"),
          "warning-soft": v("warning-soft"),
          focus: v("focus"),
        },
      },
      fontFamily: {
        sans: ["Commissioner", "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
      },
      fontSize: {
        "display-xl": type("60px", "64px", "600", "-0.035em"),
        "display-word": type("52px", "56px", "600", "-0.035em"),
        "display-sentence": type("30px", "38px", "600", "-0.02em"),
        "title-lg": type("26px", "32px", "600", "-0.015em"),
        "title-md": type("22px", "28px", "600", "-0.01em"),
        "title-sm": type("19px", "26px", "600", "-0.005em"),
        lede: type("20px", "30px", "400"),
        body: type("17px", "27px", "400"),
        label: type("17px", "22px", "600"),
        option: type("17px", "22px", "500"),
        prompt: type("16px", "24px", "500"),
        translit: type("15px", "22px", "400"),
        small: type("14px", "20px", "500"),
        caption: type("13px", "18px", "400"),
      },
      // Commissioner is loaded up to 700; extrabold maps there instead of a faux bold.
      fontWeight: {
        extrabold: "700",
      },
      borderRadius: {
        tile: "20px",
        sheet: "28px",
        full: "9999px",
      },
      boxShadow: {
        card: "var(--bk-shadow-card)",
        sheet: "var(--bk-shadow-sheet)",
      },
      spacing: {
        control: "52px",
        "control-lg": "56px",
        tile: "60px",
        "icon-button": "44px",
        chip: "36px",
      },
      maxWidth: {
        content: "560px",
      },
      opacity: {
        45: "0.45",
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
