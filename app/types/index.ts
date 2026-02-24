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

export enum SubscriptionStatus {
  TRIALING = "trialing",
  ACTIVE = "active",
  INCOMPLETE = "incomplete",
  INCOMPLETE_EXPIRED = "incomplete_expired",
  PAST_DUE = "past_due",
  CANCELED = "canceled",
  UNPAID = "unpaid",
  PAUSED = "paused",
}

export interface Subscription {
  id: string;
  status: SubscriptionStatus;
  startTime: string;
  endTime: string;
  cancelTime: string | null;
  tier: string;
}

export interface PlanPrice {
  id: string;
  amount: number;
  currency: string;
  interval: "month" | "year";
}

export enum PlanTier {
  BASIC = "basic",
  PRO = "pro",
  UNLIMITED = "unlimited",
}

export interface Plan {
  id: string;
  tier: PlanTier;
  gymsLimit: number;
  staffLimit: number;
  prices: PlanPrice[];
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
