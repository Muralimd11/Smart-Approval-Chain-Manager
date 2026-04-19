/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Segoe UI"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        brand: {
          bg: '#F8F9F5', // light cream/beige
          sidebar: '#FFFFFF', // clean white
          card: '#FFFFFF',
          text: '#2D3748', // soft dark gray for headers
          muted: '#A0AEC0', // for subtext
          accent: '#10b981', // emerald-500 matching Smart login theme
        },
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
      },
    },
  },
  plugins: [],
}
