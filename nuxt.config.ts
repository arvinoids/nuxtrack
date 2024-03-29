// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },
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
    emailToken: process.env.EMAIL_TOKEN,
    public: {
      pocketBaseURL: process.env.VITE_POCKETBASE_URL,
      emailAPI: process.env.EMAIL_API_URL,
      pbStorage: process.env.PB_LOCALSTORAGE,
    },
  },

  app: {
    baseURL: '/Tracker',
    head: {
      title: "Solutions Team Rotation Tracker",    },
    pageTransition: { name: "page", mode: "out-in" },
  },
  modules: ["@nuxtjs/color-mode",'nuxt-icon','@formkit/auto-animate','@vueuse/nuxt','nuxt-headlessui'],
  colorMode: {
    preference: "light",
    dataValue: "theme",
    classSuffix: "",
  }
});
