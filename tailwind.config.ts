import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        indigo: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7c3aed', // Royal Purple
          800: '#6d28d9', // Deep Royal Purple
          900: '#581c87', // Rich Deep Purple
          950: '#1e0836', // Deepest Velvet Purple
        },
        purple: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7c3aed', // Royal Purple Primary
          800: '#6d28d9', // Deep Purple Hover
          900: '#581c87', // Rich Velvet Purple
          950: '#1e0836', // Darkest Obsidian Purple
        },
      },
    },
  },
  plugins: [],
};
export default config;
