export enum UserRole {
  USER = "ROLE_USER",
  OWNER = "ROLE_OWNER",
}

export interface User {
  id: string;
  email: string;
  role: UserRole;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  refresh_token: string;
}

export const TOKEN_COOKIE = "TOKEN";
export const REFRESH_TOKEN_COOKIE = "REFRESH_TOKEN";
export type CookieName = typeof TOKEN_COOKIE | typeof REFRESH_TOKEN_COOKIE;
