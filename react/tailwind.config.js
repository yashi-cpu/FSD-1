/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        cyber: {
          green: '#7cff9b',
          dim: '#15321d',
          dark: '#020503',
          border: 'rgba(100, 255, 130, 0.1)',
        }
      }
    },
  },
  plugins: [],
}

