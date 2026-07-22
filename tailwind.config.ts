import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Expecta brand — warm, calm, trustworthy
        brand: {
          50: "#fdf2f6",
          100: "#fce7ef",
          200: "#fbcfe0",
          300: "#f8a8c6",
          400: "#f272a3",
          500: "#e64980",
          600: "#d12e67",
          700: "#af2054",
          800: "#921e49",
          900: "#7a1d40",
        },
        safe: "#12805c",
        caution: "#b45309",
        avoid: "#b91c1c",
      },
      fontFamily: {
        sans: ["ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
