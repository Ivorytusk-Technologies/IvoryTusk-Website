/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.html", "./*.js"],
  darkMode: 'class',
  theme: {
    extend: {
      animation: {
        'voice-wave': 'voice-wave 1.5s ease-in-out infinite'
      }
    },
  },
  plugins: [],
}