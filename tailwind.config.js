/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#c3ba9a", // thay màu này bằng màu bạn muốn cho primary
        secondary: "#c3ba9a", // thay màu này bằng màu bạn muốn cho secondary
        "theme-color-primary": "#c3ba9a",
        "theme-color-primary-dark": "#cc5200",
        "theme-color-secondary": "#fdfefe",
        "theme-color-secondary-dark": "#fdfefe",
        "theme-color-gray": "#838181",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"],
        serif: ["Merriweather", "serif"],
        primary: ["Roboto", "sans-serif", "monospace"],
      },
    },
  },
  plugins: [],
};
