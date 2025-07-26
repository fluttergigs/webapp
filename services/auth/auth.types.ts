import type { Company } from '~/features/companies/company.types';
import type { Education, Experience } from '~/features/users/user.types';

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
  documentId: string;
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
  stripeCustomerId?: string;
  companies?: Company[];
  experiences?: Experience[];
  educations?: Education[];
  [key: string]: unknown;
};
