/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3b82f6',   // blue-500
        secondary: '#1e293b', // slate-800

        light: {
          DEFAULT: '#f1f5f9', // slate-100 (Texto principal e títulos)
          muted: '#cbd5e1',   // slate-300 (Textos secundários e subtítulos)
        }
      }
    },
  },
  plugins: [],
}