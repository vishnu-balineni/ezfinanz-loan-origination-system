/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          sidebar: '#091E33',
          dark: '#050A15',
          green: '#14BA73',
          greenHover: '#10A968',
          greenLight: '#E6F8F0',
          bg: '#F2F5F8',
          text: '#233852',
          textMuted: '#6B7A90'
        }
      }
    },
  },
  plugins: [],
}
