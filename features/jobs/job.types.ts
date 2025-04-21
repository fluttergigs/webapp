import { PaymentContext, SingleApiResponse } from '~/core/shared/types';
import type { CompanyApiResponse } from '~/features/companies/company.types';
import type { UserApiResponse } from '~/features/users/user.types';

//Shared Enums
export enum SeniorityLevel {
  junior = 'junior',
  senior = 'senior',
  lead = 'lead',
  medium = 'medium',
}

export enum RemoteOptions {
  noRemote = 'noRemote',
  fullRemote = 'fullRemote',
  hybrid = 'hybrid',
}

export enum WorkType {
  fullTime = 'full-time',
  partTime = 'part-time',
  freelance = 'freelance',
  contract = 'contract',
  internship = 'internship',
  selfEmployed = 'self-employed',
}

//Core Types
export type JobOffer = {
  id: number;
  title: string;
  description: string;
  isFeatured: boolean;
  workType: WorkType;
  remoteOptions: string;
  seniorityLevel: SeniorityLevel;
  companyId: string;
  howToApply: string;
  salaryFrom: number;
  salaryTo: number;
  slug: string;
  applyBefore: Date;
  createdAt: string;
  updatedAt: string;
  company: CompanyApiResponse | number;
  workPermits: string[] | null;
  bookmarkedJob?: number;
};

export type JobPostPaymentData = {
  amount: number;
  originalEmail: string;
  paymentEmail: string;
  stripeCustomerId: string;
  context: PaymentContext.jobPost;
  originEmail: string;
};

export type BookmarkedJobOffer = {
  id: number;
  jobOffer: JobOfferApiResponse;
  user: UserApiResponse;
};

export type JobCreationRequest = Partial<
  Omit<JobOffer, 'id' | 'isFeatured' | 'createdAt' | 'updatedAt' | 'slug'>
> & {
  hasPaid: boolean;
};

// Request Types
export type JobOfferEditRequest = Partial<JobOffer>;
export type JobOfferDeleteRequest = SaveJobOfferRequest;
export type SaveJobOfferRequest = { jobOffer: number };
export type DeleteSavedJobOfferRequest = Pick<BookmarkedJobOffer, 'id'>;

// Response Types
export type JobOfferApiResponse = SingleApiResponse<JobOffer>;

//Search Filters
export interface JobSearchFilters {
  keyword?: string;
  remoteOption?: string;
  workType?: string;
  seniorityLevel?: string;
  countries?: string[];
}
