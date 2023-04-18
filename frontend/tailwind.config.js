/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
  theme: {
    extend: {
      colors: {
        green: "#7eb77f",
        "dark-green": "#5a8c5f",
        "light-green": "#a8d1a8",
        "dark-blue": "#2c3e50",
        "light-blue": "#5d7b8d",
        "lightest-blue": "#cfd9db",
        "lightest-green": "#e8f0f0",
      },
    },
  },
};
