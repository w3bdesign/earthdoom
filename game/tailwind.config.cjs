/** @type {import('tailwindcss').Config} */
const config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}", "./node_modules/flowbite/**/*.js",  "./node_modules/tw-elements/dist/js/**/*.js"],
  theme: {
    extend: {},
  },
  plugins: [require("flowbite/plugin"), require("tw-elements/dist/plugin")],
};

module.exports = config;
