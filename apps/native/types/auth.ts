import type { Session } from "better-auth/types";

export interface CashoryUser {
  id: string;
  email: string;
  emailVerified: boolean;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  image?: string | null;
  onboardingCompleted: boolean;
  country?: string | null;
  phone?: string | null;
}

export interface CashorySession extends Session {
  user: CashoryUser;
}
