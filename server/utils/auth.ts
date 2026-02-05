import type { H3Event } from "h3";

export async function refreshTokens(event: H3Event): Promise<boolean> {
  const { apiBaseUrl } = useRuntimeConfig().public;
  const refreshToken = getCookie(event, REFRESH_TOKEN_COOKIE);

  if (!refreshToken) {
    return false;
  }

  try {
    const response = await $fetch<AuthResponse>("/auth/token/refresh", {
      baseURL: apiBaseUrl,
      method: "POST",
      body: {
        refresh_token: refreshToken,
      },
    });

    setTokenCookie(event, response.token);
    setRefreshTokenCookie(event, response.refresh_token);
    return true;
  } catch {
    return false;
  }
}

export async function getAuthenticatedUser(
  event: H3Event,
): Promise<User | undefined> {
  const { apiBaseUrl } = useRuntimeConfig().public;
  let token = getCookie(event, TOKEN_COOKIE);

  // Try with current token
  if (token) {
    try {
      return await $fetch<User>("/auth/me", {
        baseURL: apiBaseUrl,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error: any) {
      if (error.status !== 401) {
        return undefined;
      }
      // Token expired, try refresh below
    }
  }

  // Try to refresh
  const refreshed = await refreshTokens(event);
  if (!refreshed) {
    return undefined;
  }

  // Get user with new token
  token = getCookie(event, TOKEN_COOKIE);
  if (!token) {
    return undefined;
  }

  try {
    return await $fetch<User>("/auth/me", {
      baseURL: apiBaseUrl,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch {
    return undefined;
  }
}
