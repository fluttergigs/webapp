import { Company } from '~/features/companies/company.types';

export interface RegistrationData {
  firstName: string | null;
  lastName: string | null;
  email?: string;
  password: string;
  identifier?: string;

  [name: string]: unknown;
}

export type LoginData = Omit<RegistrationData, 'firstName' | 'lastName'>;

export interface ResetPasswordData {
  email: string;
}

export interface ForgetPasswordData {
  email: string;
}

export type User = {
  id: number;
  username?: string;
  email?: string;
  provider?: string;
  confirmed?: boolean;
  blocked?: boolean;
  createdAt?: string;
  updatedAt?: string;
  firstName: string;
  lastName: string;
  bio: string;
  companies?: Company[];
  [key: string]: unknown;
  stripeCustomerId?: string;
};
