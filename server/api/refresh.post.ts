export default defineEventHandler(async (event) => {
  const success = await refreshTokens(event);

  if (!success) {
    throw createError({
      status: 401,
      message: "Failed to refresh token",
    });
  }

  return { success: true };
});
