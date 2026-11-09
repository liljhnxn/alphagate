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
        background: "#171321",
        card: "#251E33",
        "card-muted": "#1F192C",
        accent: {
          DEFAULT: "#C084FC",
          hover: "#A855F7",
          light: "#E9D5FF",
        },
        secondaryAccent: {
          DEFAULT: "#FB7185",
          hover: "#F43F5E",
          light: "#FECDD3",
        },
        mainText: "#F5F3FF",
        secondaryText: "#A8A1B5",
        border: "#393047",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 25px -5px rgba(192, 132, 252, 0.25)",
        "glow-rose": "0 0 25px -5px rgba(251, 113, 133, 0.25)",
      },
    },
  },
  plugins: [],
};

export default config;

