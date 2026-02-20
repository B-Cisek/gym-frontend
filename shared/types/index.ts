import type { $Fetch } from "ofetch";

declare module "h3" {
  interface H3EventContext {
    user?: User;
  }
}

declare module "#app" {
  interface NuxtApp {
    $api: $Fetch;
  }
}

export enum AppEnv {
  PRODUCTION = "production",
  DEVELOPMENT = "development",
}

export enum UserRole {
  USER = "ROLE_USER",
  OWNER = "ROLE_OWNER",
}

export interface User {
  id: string;
  email: string;
  roles: UserRole[];
  isProfileComplete: boolean;
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
export const HAS_SESSION_COOKIE = "HAS_SESSION";
export type CookieName = typeof TOKEN_COOKIE | typeof REFRESH_TOKEN_COOKIE;
