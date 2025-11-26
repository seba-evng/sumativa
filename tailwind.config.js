/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./app/**/*", "./components/**/*"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors:{
        "gold":"#d4af37"
      }
    },
  },
  plugins: [],
}