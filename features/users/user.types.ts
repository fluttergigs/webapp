import type { SingleApiResponse } from '~/core/shared/types';
import type { User } from '~/services/auth/auth.types';

export enum ExperienceType {
  internship = 'internship',
  fullTime = 'full-time',
  partTime = 'part-time',
  freelance = 'freelance',
  selfEmployed = 'self-employed',
  contract = 'contract',
  voluntary = 'voluntary',
}

export type Experience = {
  documentId?: string;
  id: number;
  title: string;
  type: ExperienceType;
  company: string;
  startDate: Date;
  endDate?: Date | null;
  description: string;
  isActive: boolean;
  user?: User | number | String;
  createdAt?: Date;
  updatedAt?: Date;
  publishedAt?: Date;
};

export type Education = {
  documentId: string;
  id: number;
  degree: string;
  field: string;
  school: string;
  startYear: number;
  endYear?: number | null;
  description: string;
  isActive: boolean;
  user?: User | number | String;
  createdAt?: Date;
  updatedAt?: Date;
  publishedAt?: Date;
};

export type UpdateUserRequestProps = {
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  bio?: string;
};

export type UpdateUserRequest = { data: UpdateUserRequestProps };

export type UpdatePasswordRequestProps = { password: String };

export type UpdatePasswordRequest = { data: UpdatePasswordRequestProps };

export type UserApiResponse = SingleApiResponse<User>;

export type AddExperienceRequest = {
  //experience without id
  data: Omit<Experience, 'id' | 'documentId' | 'createdAt' | 'updatedAt'>;
};

export type UpdateExperienceRequest = {
  data: Omit<Experience, 'documentId' | 'createdAt' | 'updatedAt' | 'publishedAt'>;
};

export type AddEducationRequest = {
  data: Omit<Education, 'id' | 'documentId' | 'createdAt' | 'updatedAt' | 'publishedAt'>;
};

export type UpdateEducationRequest = {
  data: Omit<Education, 'documentId' | 'createdAt' | 'updatedAt' | 'publishedAt'>;
};
