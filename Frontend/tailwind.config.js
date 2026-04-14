/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0b0f1a",      // deep blue-black
        foreground: "#e5e7eb",

        card: "#111827",            // dark card base
        cardBorder: "#1f2937",

        primary: "#a855f7",         // neon purple
        primaryGlow: "#d946ef",

        accent: "#22d3ee",          // cyan accent
        accentSoft: "#164e63",

        muted: "#9ca3af",
        mutedForeground: "#6b7280",

        success: "#22c55e",
        warning: "#f59e0b",
        danger: "#ef4444",
      },
      boxShadow: {
        glow: "0 0 20px rgba(168,85,247,0.35)",
        card: "0 10px 30px rgba(0,0,0,0.6)",
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem",
      },
    },
  },
  plugins: [],
};
