import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './client/src/**/*.{js,ts,jsx,tsx}',
    './client/index.html',
  ],
  theme: {
    extend: {
      colors: {
        // Cyber Noir Palette
        'slate': {
          '950': '#0f172a', // Primary Background
        },
        'cyan': {
          '400': '#22d3ee', // Neon Accent 1
        },
        'pink': {
          '500': '#ec4899', // Neon Accent 2
        },
      },
      backgroundImage: {
        'cyber-gradient': 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        'neon-cyan': 'linear-gradient(135deg, #22d3ee 0%, #06b6d4 100%)',
        'neon-pink': 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
      },
      boxShadow: {
        'neon-cyan': '0 0 20px rgba(34, 211, 238, 0.5)',
        'neon-pink': '0 0 20px rgba(236, 72, 153, 0.5)',
        'neon-glow': '0 0 30px rgba(34, 211, 238, 0.3), 0 0 60px rgba(236, 72, 153, 0.2)',
      },
      animation: {
        'pulse-neon': 'pulse-neon 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite',
      },
      keyframes: {
        'pulse-neon': {
          '0%, 100%': { opacity: '1', boxShadow: '0 0 20px rgba(34, 211, 238, 0.5)' },
          '50%': { opacity: '0.8', boxShadow: '0 0 30px rgba(34, 211, 238, 0.8)' },
        },
        'glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(34, 211, 238, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(34, 211, 238, 0.6)' },
        },
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
  ],
};

export default config;
