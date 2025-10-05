import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3b82f6', // A nice blue
        light: '#f9fafb',   // Very light gray for background
        medium: '#e5e7eb', // A bit darker for cards/borders
        dark: '#1f2937',    // For text
      },
    },
  },
  plugins: [],
}
export default config
