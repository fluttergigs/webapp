import {UserApiResponse} from "~/features/users/user.types";
import {MultiApiResponse} from "~/core/shared/types";

export interface Company {
    name: string,
    website: string,
    email: string,
    logo: string,
    job_offers: [],
    description: string,
    user: UserApiResponse,

    [key: string]: any,
}

export type CreateCompanyRequestProps = { description: string & Omit<Company, 'job_offers' | 'user'> }

export type CreateCompanyRequest = { data: CreateCompanyRequestProps }

export type UpdateCompanyRequest = { data: Partial<CreateCompanyRequestProps> }

export type ListCompanyApiResponse = MultiApiResponse<Company>

