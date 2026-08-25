import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#07090b",
        panel: "#0c1114",
        cyan: "#a7eaff",
        ice: "#d8f6ff",
        violet: "#9b9cff",
        lime: "#d4f56a",
        dim: "#68767d",
      },
      fontFamily: {
        display: ["Arial", "Helvetica Neue", "sans-serif"],
        mono: ["SFMono-Regular", "Consolas", "Liberation Mono", "monospace"],
      },
      boxShadow: {
        halo: "0 0 90px rgba(167, 234, 255, 0.13)",
      },
    },
  },
  plugins: [],
};

export default config;
