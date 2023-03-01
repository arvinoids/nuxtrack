/** @type {import('tailwindcss').Config} */
const plugin = require('tailwindcss/plugin')
module.exports = {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./nuxt.config.{js,ts}",
    "./app.vue",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [{
      light: {
        "primary": "#00C425",
        "secondary": "#008A44",
        "accent": "#1C64B4",
        "neutral": "#EBEBEB",
        "base-100": "#ffffff",
        "base-200": "#CACACA",
        "base-300": "#8a8a8a",
        "info": "#006446",
        "success": "#3AF23A",
        "warning": "#FAA519",
        "error": "#dc2626",
        "--btn-text-case":"none",
        "--rounded-btn":"none",
      },
      dark: {
        "primary": "#a3e635", 
        "secondary": "#15803d",
        "accent": "#a7f3d0",
        "neutral": "#1B1D1D",    
        "base-100": "#212121",
        "info": "#2563EB",
        "success": "#16A34A",
        "warning": "#D97706",
        "error": "#DC2626",
        "--btn-text-case": "none",
        "--rounded-btn":"none",
        },
    }, ],
    darkTheme: "darkLex"
  }
}
