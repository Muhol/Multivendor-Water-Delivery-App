/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#3498db",
        primarybg: "#f0f0f0",
        secondary: "#f1c40f",
        background: "#f9f9f9",
        // accentbg: "#deb020",
        accentbg: "#d9a31b",
        // accentbg: "#d8b100",
        accenttxt: "#e6c200",
        text: "#333",
    }
    },
  },
  plugins: [],
}

