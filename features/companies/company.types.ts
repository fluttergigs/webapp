import {UserApiResponse} from "~/features/users/user.types";
import {MultiApiResponse, SingleApiResponse} from "~/core/shared/types";
import type {JobOffer} from "~/features/jobs/job.types";


//TODO - add company twitter and linkedin property
export interface Company {
    id: number,
    name: string,
    website: string,
    email: string,
    logo: string,
    jobOffers: MultiApiResponse<JobOffer>,
    description: string,
    user: UserApiResponse,
    createdAt: string,
    size: CompanySize,
    linkedin: string,
    twitter: string,
    slug: string,
    hasFreeJobPosts: boolean

    [key: string]: any,
}

export enum CompanySize {
    micro = "micro",
    small = "small",
    medium = "medium",
    large = "large"
}

export interface CompanySearchFilters {
    keyword?: string,
    size?: string,
}

export type CompanyApiResponse = SingleApiResponse<Company>
export type CreateCompanyRequestProps = { description: string & Omit<Company, 'jobOffers' | 'user'> & { user: number } }

export type CreateCompanyRequest = { data: CreateCompanyRequestProps }

export type UpdateCompanyRequest = { data: Partial<CreateCompanyRequestProps> }

export type ListCompanyApiResponse = MultiApiResponse<Company>