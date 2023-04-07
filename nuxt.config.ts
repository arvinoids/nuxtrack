// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  typescript: {
    strict:true
  },
  ssr: false,

  // https://tailwindcss.com/docs/guides/nuxtjs#3
  css: ["~/assets/css/main.css"],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  runtimeConfig: {
    public: {
      pocketBaseURL: process.env.VITE_POCKETBASE_URL,
    },
  },

  app: {
    head: {
      title: "Solutions Team Rotation Tracker",    },
    pageTransition: { name: "page", mode: "out-in" },
  },
  modules: ["@nuxtjs/color-mode"],
  colorMode: {
    preference: "light",
    dataValue: "theme",
    classSuffix: "",
  },
});
