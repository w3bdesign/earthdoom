/** @type {import('tailwindcss').Config} */
const config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Surfaces, darkest to lightest
        ground: "#0a0f16",
        rail: "#0c1726",
        panel: "#111a26",
        raised: "#172231",
        sunken: "#0c131c",
        line: "#223044",
        "line-strong": "#31435b",
        // Form control edges: at least 3:1 against panel and raised
        field: "#66778d",
        // Text
        ink: "#e7edf5",
        muted: "#9aa9bc",
        // Accent and states
        accent: { DEFAULT: "#4cc3f2", strong: "#86d8f8", ink: "#05131d" },
        hostile: { DEFAULT: "#f68a8a", strong: "#ef5f5f" },
        friendly: "#5fd68f",
        caution: "#f2c45a",
        // Resources
        credits: "#f2c45a",
        titanium: "#b9c6d6",
        energy: "#a99cf6",
      },
      fontFamily: {
        sans: [
          "var(--font-archivo)",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],
      },
      boxShadow: {
        panel:
          "0 1px 0 0 rgb(255 255 255 / 0.03) inset, 0 8px 24px -12px rgb(0 0 0 / 0.6)",
        sheet: "0 -12px 32px -8px rgb(0 0 0 / 0.7)",
      },
    },
  },
  plugins: [],
};

module.exports = config;
