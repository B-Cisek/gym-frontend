export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const refreshToken = getCookie(event, TOKEN_COOKIE);

  if (refreshToken) {
    await $fetch("/auth/logout", {
      baseURL: config.public.apiBaseUrl,
      method: "POST",
      body: {
        refresh_token: refreshToken,
      },
    });
  }

  clearAuthCookies(event);

  return {
    success: true,
  };
});
