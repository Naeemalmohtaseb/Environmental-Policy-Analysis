/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#f7f5f0',
        ink: '#1f2933',
        muted: '#5f6b76',
        line: '#d9ded8',
        panel: '#fffdf8',
        accent: {
          DEFAULT: '#2f6f68',
          dark: '#24564f',
          pale: '#dfece8',
        },
        burden: {
          low: '#dbe7de',
          mid: '#d7c98f',
          high: '#b6604b',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'SFMono-Regular', 'Consolas', 'monospace'],
      },
      boxShadow: {
        soft: '0 18px 45px rgba(31, 41, 51, 0.08)',
      },
    },
  },
  plugins: [],
};
