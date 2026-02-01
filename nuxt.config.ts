// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  typescript: {
    typeCheck: false,
  },
  modules: ["@nuxt/eslint", "@nuxt/icon", "@nuxt/ui", "@nuxt/content"],
  css: ["~/assets/css/main.css"],
  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.NUXT_API_BASE_URL || "http://localhost",
      appEnv: process.env.NUXT_APP_ENV || "development",
    },
  },
});
