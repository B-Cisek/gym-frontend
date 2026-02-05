export default defineNuxtPlugin((nuxtApp) => {
  const { apiBaseUrl } = useRuntimeConfig().public;
  const { fetchUser, clearAuthState } = useAuth();
  let isRefreshing = false;
  let refreshSubscribers: Array<{
    resolve: (token: string) => void;
    reject: (error: Error) => void;
  }> = [];

  const api = $fetch.create({
    baseURL: apiBaseUrl,
    onRequest: ({ options }) => {
      const cookie = useCookie(TOKEN_COOKIE);

      if (cookie.value) {
        options.headers.set("Authorization", `Bearer ${cookie.value}`);
      }
    },
    onResponseError: async ({ request, response, options }) => {
      if (response.status === 401) {
        if (!isRefreshing) {
          isRefreshing = true;

          $fetch("/api/refresh", {
            method: "POST",
          })
            .then(async () => {
              const cookie = useCookie(TOKEN_COOKIE);
              isRefreshing = false;

              refreshSubscribers.forEach((subscriber) =>
                subscriber.resolve(cookie.value!),
              );
              refreshSubscribers = [];

              await fetchUser();
            })
            .catch(() => {
              isRefreshing = false;

              clearAuthState();

              nuxtApp.runWithContext(() => navigateTo("/login"));

              refreshSubscribers.forEach((subscriber) =>
                subscriber.reject(new Error("Token refresh failed")),
              );
              refreshSubscribers = [];
            });
        }

        return new Promise((resolve, reject) => {
          refreshSubscribers.push({
            resolve: async (token: string) => {
              options.headers.set("Authorization", `Bearer ${token}`);
              try {
                const retryOptions = {
                  ...options,
                  baseURL: apiBaseUrl,
                };
                const result = await $fetch(request, retryOptions);
                resolve(result);
              } catch (retryError) {
                reject(retryError);
              }
            },
            reject,
          });
        });
      }
    },
  });

  return {
    provide: {
      api,
    },
  };
});
