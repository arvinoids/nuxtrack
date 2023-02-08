/** @type {import('tailwindcss').Config} */
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
      mytheme: {
        "primary": "#00C425",
        "secondary": "#008A44",
        "accent": "#1C64B4",
        "neutral": "#CACACA",
        "base-100": "#EBEBEB",
        "base-200": "#8A8A8A",
        "base-300": "#32323C",
        "info": "#006446",
        "success": "#3AF23A",
        "warning": "#FAA519",
        "error": "#dc2626",
        "--btn-text-case":"none"
      }
    }, "emerald", "forest"],
    darkTheme: "forest"
  }
}
