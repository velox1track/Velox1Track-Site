/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'velox-teal': '#64E2D3',
        'velox-gray': '#E7E3E9',
        'velox-dark': '#1C1F22',
      },
      animation: {
        'spin-slow': 'spin 3s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
      },
      transitionDuration: {
        '3000': '3000ms',
      }
    },
  },
  plugins: [],
} 