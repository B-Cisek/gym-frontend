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
