import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0d0d0d",
        violet: {
          DEFAULT: "#6a4cf7",
          light: "#9080ff",
          dark: "#5335d5",
        },
        green: {
          DEFAULT: "#3ecf8e",
          glow: "#3ecf8e33",
        },
        cream: {
          DEFAULT: "#f0ede8",
          dim: "#d8d3cb",
        },
        gray: {
          sub: "#8a8480",
          border: "rgba(255, 255, 255, 0.10)",
          glass: "rgba(255, 255, 255, 0.06)",
        },
        blue: {
          accent: "#4c8dff",
        },
        cyan: {
          accent: "#38d9f0",
        },
      },
      fontFamily: {
        sans: ["var(--font-hanken)", "Hanken Grotesk", "sans-serif"],
        serif: ["var(--font-instrument)", "Instrument Serif", "serif"],
        mono: ["var(--font-geist-mono)", "Geist Mono", "monospace"],
      },
      boxShadow: {
        glass: "0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.12)",
        "glass-sm": "inset 0 1px 0 rgba(255, 255, 255, 0.08)",
        glow: "0 10px 28px -6px rgba(106, 76, 247, 0.55)",
        "glow-green": "0 0 12px rgba(62, 207, 142, 0.45)",
      },
      backdropBlur: {
        glass: "20px",
        card: "12px",
      },
      animation: {
        "wave-bounce": "wave 1.2s ease-in-out infinite alternate",
        "pulse-subtle": "pulseSubtle 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "float-slow": "float 6s ease-in-out infinite",
      },
      keyframes: {
        wave: {
          "0%": { transform: "scaleY(0.25)" },
          "100%": { transform: "scaleY(1)" },
        },
        pulseSubtle: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
