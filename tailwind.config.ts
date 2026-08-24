import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#08090a",
        panel: "#0d1011",
        acid: "#d9ff5f",
        signal: "#8ce8ff",
        steel: "#9ca5a7",
      },
      fontFamily: {
        display: ["Arial", "Helvetica Neue", "sans-serif"],
        mono: ["SFMono-Regular", "Consolas", "Liberation Mono", "monospace"],
      },
      boxShadow: {
        glow: "0 0 80px rgba(140, 232, 255, 0.12)",
      },
    },
  },
  plugins: [],
};

export default config;
