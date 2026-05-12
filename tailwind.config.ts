import type { Config } from 'tailwindcss'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Define your custom colors here
        // e.g., primary: '#3b82f6'
      },
      fontFamily: {
        // Define your custom font families here
        // e.g., sans: ['Inter', 'sans-serif']
      },
    },
  },
  plugins: [],
} satisfies Config
