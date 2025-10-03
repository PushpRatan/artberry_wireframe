/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#EF473B', // Berry red
        },
        secondary: {
          DEFAULT: '#6a1b9a', // Berry purple
        },
        tertiary: {
          DEFAULT: '#2ecc71', // Berry fresh green
        },
        dark: {
          DEFAULT: '#2b2b2b', // Deep charcoal
        },
        light: {
          DEFAULT: '#fff6f6', // Soft white
        },
      },
    },
  },
  plugins: [],
}
