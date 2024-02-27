import {UserApiResponse} from "~/features/users/user.types";
import {MultiApiResponse, SingleApiResponse} from "~/core/shared/types";


//TODO - add company size property
export interface Company {
    id: number,
    name: string,
    website: string,
    email: string,
    logo: string,
    jobOffers: [],
    description: string,
    user: UserApiResponse,
    createdAt: string,
    size: CompanySize,

    [key: string]: any,
}

export enum CompanySize {
    micro = "micro",
    small = "small",
    medium = "medium",
    large = "large"
}




export type CompanyApiResponse = SingleApiResponse<Company>
export type CreateCompanyRequestProps = { description: string & Omit<Company, 'jobOffers' | 'user'> }

export type CreateCompanyRequest = { data: CreateCompanyRequestProps }

export type UpdateCompanyRequest = { data: Partial<CreateCompanyRequestProps> }

export type ListCompanyApiResponse = MultiApiResponse<Company>