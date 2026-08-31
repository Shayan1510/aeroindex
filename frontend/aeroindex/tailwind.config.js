/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        base: {
          light: "#F7F5EF",
          dark: "#08111F",
        },
        surface: {
          light: "#FFFFFF",
          light2: "#F0EEE6",
          dark: "#101B2D",
          dark2: "#15233A",
        },
        ink: {
          light: "#0F2340",
          mute: "#5B6B84",
          dark: "#F2F5FA",
          darkMute: "#93A4BF",
        },
        brass: {
          DEFAULT: "#C9972E",
          soft: "#E4B65C",
        },
        signal: {
          DEFAULT: "#3D6FE0",
          soft: "#6C93EE",
        },
        good: "#2E9E6B",
        warn: "#C9972E",
        bad: "#C24B4B",
        border: {
          light: "rgba(15,35,64,0.10)",
          dark: "rgba(242,245,250,0.09)",
        },
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      backdropBlur: {
        xs: "2px",
      },
      boxShadow: {
        glass: "0 8px 40px -8px rgba(8,17,31,0.35)",
        glassLight: "0 8px 40px -8px rgba(15,35,64,0.14)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [],
};
