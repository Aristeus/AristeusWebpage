/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Aristeus Corporate Palette
        'aristeus': {
          'navy': '#1B2A4A',
          'green': '#7AB929',
        },
        // Backgrounds
        'bg': {
          'primary': '#0D1117',
          'secondary': '#161B22',
          'card': '#1C2333',
        },
        // Text
        'text': {
          'primary': '#E8ECF1',
          'secondary': '#8B949E',
        },
        'border-subtle': '#30363D',
        // Grass Gauge Palette
        'gg': {
          'green-dark': '#1B7A2B',
          'green-mid': '#4CAF50',
          'green-light': '#7AB929',
        },
        // CattleVision Palette
        'cv': {
          'charcoal': '#2C3E3E',
          'gold': '#B8963E',
          'dark': '#1A2424',
        }
      },
      fontFamily: {
        'heading': ['"Space Grotesk"', 'sans-serif'],
        'body': ['Inter', 'sans-serif'],
        'data': ['"JetBrains Mono"', 'monospace'],
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease-out forwards',
        'fade-in': 'fadeIn 0.4s ease-out forwards',
        'slide-left': 'slideLeft 0.5s ease-out forwards',
        'slide-right': 'slideRight 0.5s ease-out forwards',
        'counter': 'counter 1s ease-out forwards',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideLeft: {
          '0%': { opacity: '0', transform: 'translateX(32px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideRight: {
          '0%': { opacity: '0', transform: 'translateX(-32px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
      backdropBlur: {
        'xs': '2px',
      },
      backgroundImage: {
        'gg-gradient': 'linear-gradient(135deg, #1B7A2B, #7AB929)',
        'cv-gradient': 'linear-gradient(135deg, #2C3E3E, #B8963E)',
      },
    },
  },
  plugins: [],
}
