export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();
  const cookie = useCookie("TOKEN");

  const api = $fetch.create({
    baseURL: config.public.apiBaseUrl,
    onRequest: ({ options }) => {
      if (cookie.value) {
        options.headers.set("Authorization", `Bearer ${cookie.value}`);
      }
    },
    onResponseError: async ({ response }) => {
      if (response.status === 401) {
        await nuxtApp.runWithContext(() => navigateTo("/login"));
      }
    },
  });

  return {
    provide: {
      api,
    },
  };
});
