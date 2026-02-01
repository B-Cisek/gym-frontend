import type { H3Event } from "h3";

const TOKEN_MAX_AGE = 900; // 15 min
const REFRESH_TOKEN_MAX_AGE = 2592000; // 30 days

function setAuthCookie(
  event: H3Event,
  name: string,
  value: string,
  maxAge: number,
  httpOnly: boolean = true,
) {
  const config = useRuntimeConfig();

  setCookie(event, name, value, {
    httpOnly: httpOnly,
    path: "/",
    sameSite: "lax",
    secure: config.appEnv === AppEnv.PRODUCTION,
    maxAge: maxAge,
  });
}

export function setTokenCookie(event: H3Event, token: string) {
  // httpOnly: false - better set it to true, but token lifetime is 15 min so fuck it
  // TODO: change in the future
  setAuthCookie(event, TOKEN_COOKIE, token, TOKEN_MAX_AGE, false);
}

export function setRefreshTokenCookie(event: H3Event, refreshToken: string) {
  setAuthCookie(
    event,
    REFRESH_TOKEN_COOKIE,
    refreshToken,
    REFRESH_TOKEN_MAX_AGE,
  );
}

export function clearAuthCookies(event: H3Event) {
  deleteCookie(event, TOKEN_COOKIE);
  deleteCookie(event, REFRESH_TOKEN_COOKIE);
}
