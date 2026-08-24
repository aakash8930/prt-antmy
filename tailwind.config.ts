import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        abyss: {
          bg: "#031018",
          shadow: "#02070B",
          ocean: "#062638",
          cyan: "#58D8FF",
          softblue: "#8ADFFF",
        },
      },
      fontFamily: {
        serif: ["Georgia", "Cambria", "serif"],
        sans: ["Helvetica Neue", "Arial", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
