/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ], 
  theme: {
    extend: {
      fontFamily: {
        pixel: ["var(--font-pixel)", "sans-serif"],
        outfit: ["var(--font-heading)", "sans-serif"],
      },
      colors: {
        border: "var(--border)",
      },
    },
  },

  plugins: [],
}


