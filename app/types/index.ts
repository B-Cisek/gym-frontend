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

export enum AuthErrorCode {
  EMAIL_ALREADY_TAKEN = "EMAIL_ALREADY_TAKEN",
  VALIDATION_ERROR = "VALIDATION_ERROR",
  UNKNOWN_ERROR = "UNKNOWN_ERROR",
  INVALID_CREDENTIALS = "INVALID_CREDENTIALS",
}

export class AuthError extends Error {
  constructor(
    public code: AuthErrorCode,
    message: string,
    public status?: number,
  ) {
    super(message);
    this.name = "AuthError";
  }
}

export interface ApiError {
  status: number;
  message?: string;
}
