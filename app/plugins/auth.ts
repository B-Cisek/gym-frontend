export default defineNuxtPlugin(async () => {
  const event = useRequestEvent();
  const { user } = useAuth();

  if (import.meta.server) {
    if (event?.context?.user) {
      user.value = event.context.user;
    }
    return;
  }

  if (user.value) return;

  const tokenCookie = useCookie(TOKEN_COOKIE);
  const hasSessionCookie = useCookie(HAS_SESSION_COOKIE);

  // No session indicator — anonymous user, skip entirely (no unnecessary requests)
  if (!hasSessionCookie.value) return;

  if (!tokenCookie.value) {
    // Token expired but session exists — attempt silent refresh
    try {
      await $fetch("/api/refresh", { method: "POST" });
    } catch {
      return;
    }
  }

  // Fetch user with current access token.
  // Use $fetch directly to avoid $api's automatic redirect to /login on failure —
  // redirecting unauthenticated users is the responsibility of the auth route middleware.
  try {
    const config = useRuntimeConfig();
    const token = useCookie(TOKEN_COOKIE);
    if (!token.value) return;

    user.value = await $fetch<User>("/auth/me", {
      baseURL: config.public.apiBaseUrl,
      headers: { Authorization: `Bearer ${token.value}` },
    });
  } catch {
    // Could not fetch user — leave as null
  }
});
