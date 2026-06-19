/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        terminal: {
          bg: '#0a0010',
          surface: '#12002a',
          primary: '#c084fc',
          untyped: '#4a3a5e',
          error: '#ff4d8b',
          accent: '#bf00ff',
          border: '#3d1a52',
        },
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        glow: '0 0 8px #bf00ff',
        'glow-sm': '0 0 4px #bf00ff',
      },
    },
  },
  plugins: [],
}
