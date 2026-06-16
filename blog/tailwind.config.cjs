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
      fontFamily: {
        'roboto': ['Roboto', 'sans-serif'],
      },
      letterSpacing: {
        'body': '0.5px',
      },
      keyframes: {
        typing: {
          from: { width: '0' },
          to: { width: '100%' }
        },
        blinkCaret: {
          'from, to': { borderColor: 'transparent' },
          '50%': { borderColor: '#fff' }
        },
        removeCaret: {
          to: { borderRight: 'none' }
        },
        fadeInTop: {
          from: { opacity: '0', transform: 'translateY(-20px)' },
          to: { opacity: '1', transform: 'translateY(0)' }
        },
        fadeInUp: {
          to: { opacity: '1', transform: 'translateY(0)' }
        }
      },
      animation: {
        'typed-out': 'typing 2s steps(20, end), blinkCaret 0.75s step-end 8, removeCaret 0s 1.2s forwards',
        'fade-in-top-second': 'fadeInTop 0.7s ease-in-out 2s forwards',
        'fade-in-top-third': 'fadeInTop 0.7s ease-in-out 2.7s forwards',
        'fade-in-cta': 'fadeInUp 0.7s ease-out 3.2s forwards',
      }
    },
  },
  plugins: [],
};
