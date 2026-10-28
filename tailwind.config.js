/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#F6F1E8',
        'paper-dark': '#EDE6D8',
        card: '#FFFCF6',
        ink: '#211F1C',
        muted: '#6E685F',
        line: '#D9D0C3',
        'line-dark': '#C5BCAC',
        vermilion: {
          DEFAULT: '#C8462D',
          light: '#F8ECE9',
          border: '#E8A599',
          dark: '#A3331D',
        },
        forest: {
          DEFAULT: '#426B55',
          light: '#EDF4EE',
          border: '#A7C7B3',
        },
        amber: {
          DEFAULT: '#B47318',
          light: '#FCF5E8',
          border: '#E2CA9E',
        },
      },
      fontFamily: {
        serif: ['Fraunces', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        paper: '0 1px 3px rgba(33, 31, 28, 0.05), 0 4px 12px rgba(33, 31, 28, 0.03)',
        'paper-hover': '0 2px 6px rgba(33, 31, 28, 0.08), 0 8px 20px rgba(33, 31, 28, 0.05)',
        stamp: 'inset 0 0 0 2px #C8462D',
      },
    },
  },
  plugins: [],
};
