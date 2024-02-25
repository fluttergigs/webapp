import type {CompanyApiResponse} from "~/features/companies/company.types";

export type JobOffer = {
    id: number,
    title: string,
    description: string,
    isFeatured: boolean,
    workType: string,
    remoteOptions: string,
    companyId: string,
    howToApply: string,
    salaryFrom: number,
    salaryTo: number,
    company: CompanyApiResponse,
}