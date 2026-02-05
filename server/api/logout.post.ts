export default defineEventHandler(async (event) => {
  const { apiBaseUrl } = useRuntimeConfig().public;
  const refreshToken = getCookie(event, REFRESH_TOKEN_COOKIE);

  if (refreshToken) {
    await $fetch("/auth/logout", {
      baseURL: apiBaseUrl,
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
