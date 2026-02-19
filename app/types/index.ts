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

export interface Gym {
  id: string;
  name: string;
  createdAt: string;
  street?: string;
  city?: string;
  postalCode?: string;
}

export interface GymMenu {
  id: string;
  name: string;
}

export interface Subscription {
  status: "active" | "expired" | "none";
  planName?: string;
  currentPeriodEnd?: string;
}

export interface OwnerSettings {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  companyName?: string;
  taxId?: string;
  street?: string;
  city?: string;
  postalCode?: string;
}
