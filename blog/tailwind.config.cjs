/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      backgroundImage: {
        "space-ship": "url('/images/spaceship.jpg')",
        "large-space-ship": "url('/images/spaceship.png')",
        "cool-space-ship": "url('/images/new-spaceship.jpg')",
      },
    },
  },
  plugins: [],
};
