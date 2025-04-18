import { type MultiApiResponse, SingleApiResponse } from '~/core/shared/types';

export interface LearnResource {
  id: number,
  title: string,
  description: string,
  link: string,
  category: LearnCategoryApiResponse
}


export interface LearnCategory {
  id: number,
  title: string,
  description: string,
  slug: string,
  resources: LearnResource[]
}

export type LearnCategoryApiResponse = SingleApiResponse<LearnCategory>

export type LearnResourceApiResponse = MultiApiResponse<LearnResource>
