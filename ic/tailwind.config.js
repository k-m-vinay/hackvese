/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        harvest: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
        },
        earth: {
          50: '#fdf8f0',
          100: '#f5e6d3',
          200: '#e8cca6',
          300: '#d4a574',
          400: '#c4864e',
          500: '#a66b33',
          600: '#8b5529',
          700: '#704321',
          800: '#5a351a',
          900: '#4a2c16',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
