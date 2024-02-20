import {UserApiResponse} from "~/features/users/user.types";
import {MultiApiResponse} from "~/core/shared/types";

export interface Company {
    name: string,
    website: string,
    email: string,
    logo: string,
    job_offers: [],
    user: UserApiResponse

    [key: string]: string,
}

export type CreateCompanyRequest = Omit<Company, 'user_id' | 'job_offers'>

export type ListCompanyApiResponse = MultiApiResponse<Company>

