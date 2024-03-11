/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/tw-elements/js/**/*.js"
  ],
  theme: {
    extend: {},
  },
  plugins: [require("tw-elements/plugin.cjs")],
};

module.exports = config;
