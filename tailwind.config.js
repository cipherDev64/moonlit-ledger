/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        parchment: {
          50: '#fdfbf7',
          100: '#f7f3e8',
          200: '#efe5cd',
          300: '#e4d2aa',
          400: '#d6b881',
          500: '#c99f5d',
          600: '#ba8449',
          700: '#9b693c',
          800: '#7f5434',
          900: '#68452e',
        },
        ink: {
          900: '#1a1a1a',
          800: '#2d2d2d',
        }
      },
      backgroundImage: {
        'parchment-texture': "url('https://www.transparenttextures.com/patterns/paper.png')", // Placeholder or use CSS noise
      }
    },
  },
  plugins: [],
}
