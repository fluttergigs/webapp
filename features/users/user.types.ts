import { SingleApiResponse } from '~/core/shared/types';
import { User } from '~/services/auth/auth.types';

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
  id: number;
  title: string;
  type: ExperienceType;
  company: string;
  startDate: Date;
  endDate?: Date;
  description: string;
  isActive: boolean;
  user?: User;
};

export type Education = {
  id: number;
  degree: string;
  field: string;
  title: string;
  school: string;
  startYear: string;
  endYear?: string;
  description: string;
  hasGraduated: boolean;
  user?: User;
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
  data: Omit<Experience, 'id' | 'user'>;
};

export type AddEducationRequest = {
  data: Omit<Education, 'id' | 'user'>;
};
