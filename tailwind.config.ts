import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        blush: {
          50: "#fdf2f6",
          100: "#fbe6ee",
          200: "#f6c6d9",
          300: "#eea0bd",
          400: "#e2709c",
          500: "#d1467d",
          600: "#b52d63",
          700: "#932050",
          800: "#6c1739",
          900: "#4a0f28",
        },
        wine: {
          50: "#fbf2f3",
          100: "#f2dde0",
          200: "#e1b3ba",
          300: "#c97e8b",
          400: "#a8505f",
          500: "#833141",
          600: "#6b2434",
          700: "#521b28",
          800: "#3a121c",
          900: "#240b12",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        sans: ["var(--font-sans)", "sans-serif"],
      },
      boxShadow: {
        soft: "0 10px 40px -12px rgba(107, 36, 52, 0.35)",
        card: "0 4px 24px -4px rgba(107, 36, 52, 0.15)",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        floatHeart: {
          "0%, 100%": { transform: "translateY(0) rotate(-4deg)" },
          "50%": { transform: "translateY(-10px) rotate(4deg)" },
        },
      },
      animation: {
        fadeIn: "fadeIn 0.5s ease-out both",
        floatHeart: "floatHeart 6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
