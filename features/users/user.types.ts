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
  data: Omit<Experience, 'id' | 'documentId'>;
};

export type AddEducationRequest = {
  data: Omit<Education, 'id' | 'documentId'>;
};
