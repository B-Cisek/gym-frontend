export default defineEventHandler(async (event) => {
  const data = (await readBody(event)) as AuthResponse;

  setTokenCookie(event, data.token);
  setRefreshTokenCookie(event, data.refresh_token);

  return {
    success: true,
  };
});
