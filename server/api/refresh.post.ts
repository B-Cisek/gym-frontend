export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const refreshToken = getCookie(event, REFRESH_TOKEN_COOKIE);

  if (!refreshToken) {
    throw createError({
      status: 401,
      message: "Refresh token not found",
    });
  }

  try {
    const response = await $fetch<AuthResponse>("/auth/token/refresh", {
      baseURL: config.public.apiBaseUrl,
      method: "POST",
      body: {
        refresh_token: refreshToken,
      },
    });

    setTokenCookie(event, response.token);
    setRefreshTokenCookie(event, response.refresh_token);
  } catch {
    throw createError({
      status: 401,
      message: "Failed to refresh token",
    });
  }

  return {
    success: true,
  };
});
