/** @type {import('tailwindcss').Config} */
import typography from '@tailwindcss/typography'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Source Sans 3"', 'sans-serif'],
        quicksand: ['Quicksand', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
        sora: ['Sora', 'sans-serif'],
        'space-mono': ['"Space Mono"', 'monospace'],
        'space-grotesk': ['"Space Grotesk"', 'sans-serif'],
      },
      colors: {
        // Brand color
        'brand-blue': '#F0F0F0',
        // Dark mode colors
        'cyber': {
          black: '#0F0F12',
          dark: '#1A1A1F',
          gray: '#2A2A30',
          'gray-light': '#3A3A45',
          'gray-lighter': '#4A4A55',
        },
        // Accent colors
        'neon': {
          blue: '#F0F0F0',    // Royal blue accent
          purple: '#F0F0F0',  // Soft purple accent
          teal: '#F0F0F0',    // Teal accent
          slate: '#F0F0F0',   // Slate accent
        },
        // Light mode colors
        'terminal': {
          white: '#F7F7F9',
          light: '#EDEDF0',
          silver: '#D8D8E0',
        },
        // Border colors
        'slate': {
          300: '#6C757D',
          600: '#A0A0A0',
        },
        // Background colors
        'off-white': '#F8F9FA',
        // Rich Midnight Blue (from text-box)
        'midnight-blue': '#F0F0F0',
      },
      animation: {
        'cursor-blink': 'cursor-blink 1s step-end infinite',
        'text-fade-in': 'text-fade-in 0.5s ease-out',
        'slide-up': 'slide-up 0.3s ease-out',
      },
      keyframes: {
        'cursor-blink': {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0 },
        },
        'text-fade-in': {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        'slide-up': {
          '0%': { transform: 'translateY(10px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
      },
      boxShadow: {
        'neon-blue': '0px 0px 10px rgba(240, 240, 240, 0.4)',
      },
    },
  },
  plugins: [
    typography,
  ],
  darkMode: 'class',
}