export default defineEventHandler(async (event) => {
  const url = getRequestURL(event);

  // Skip auth middleware for API routes - they handle auth themselves
  if (url.pathname.startsWith("/api/")) {
    return;
  }

  const user = await getAuthenticatedUser(event);
  event.context.user = user;
});
