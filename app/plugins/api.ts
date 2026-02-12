export default defineNuxtPlugin((nuxtApp) => {
  const { apiBaseUrl } = useRuntimeConfig().public;
  const { fetchUser, clearAuthState } = useAuth();
  let refreshPromise: Promise<void> | null = null;

  async function doRefresh(): Promise<void> {
    if (refreshPromise) return refreshPromise;

    refreshPromise = $fetch("/api/refresh", { method: "POST" })
      .then(async () => {
        await fetchUser();
      })
      .catch(() => {
        clearAuthState();
        nuxtApp.runWithContext(() => navigateTo("/login"));
        throw new Error("Token refresh failed");
      })
      .finally(() => {
        refreshPromise = null;
      });

    return refreshPromise;
  }

  const baseFetch = $fetch.create({
    baseURL: apiBaseUrl,
    onRequest: ({ options }) => {
      const cookie = useCookie(TOKEN_COOKIE);

      if (cookie.value) {
        options.headers.set("Authorization", `Bearer ${cookie.value}`);
      }
    },
  });

  const api = (async (request, options) => {
    try {
      return await baseFetch(request, options);
    } catch (error: any) {
      if (error?.response?.status !== 401) throw error;

      await doRefresh();

      return await baseFetch(request, options);
    }
  }) as typeof baseFetch;

  return {
    provide: {
      api,
    },
  };
});
