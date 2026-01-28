// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  typescript: {
    typeCheck: false
  },
  modules: ['@nuxt/eslint', '@nuxt/icon', '@nuxt/ui'],
  css: ['~/assets/css/main.css'],
})