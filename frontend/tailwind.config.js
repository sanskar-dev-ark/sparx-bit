/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: '#F7F7FA',
        'ob-bg': '#ECEEF8',
        primary: '#1A1A2E',
        secondary: '#6B7280',
      },
    },
  },
  plugins: [],
}
