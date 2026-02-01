export enum AppEnv {
  PRODUCTION = "production",
  DEVELOPMENT = "development",
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  refresh_token: string;
}

export const TOKEN_COOKIE = "TOKEN";
export const REFRESH_TOKEN_COOKIE = "REFRESH_TOKEN";
export type CookieName = typeof TOKEN_COOKIE | typeof REFRESH_TOKEN_COOKIE;
