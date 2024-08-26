import type {CompanyApiResponse} from "~/features/companies/company.types";
import {SingleApiResponse} from "~/core/shared/types";
import type {UserApiResponse} from "~/features/users/user.types";

export type JobOffer = {
    id: number,
    title: string,
    description: string,
    isFeatured: boolean,
    workType: WorkType,
    remoteOptions: string,
    seniorityLevel: SeniorityLevel,
    companyId: string,
    howToApply: string,
    salaryFrom: number,
    salaryTo: number,
    slug: string,
    applyBefore: Date,
    createdAt: string,
    updatedAt: string,
    company: CompanyApiResponse | number,
    workPermits: string[] | null,
    bookmarkedJob?: number,
}

export type BookmarkedJobOffer = {
    id: number,
    attributes: {
        jobOffer: JobOfferApiResponse,
        user: UserApiResponse,
    }
}

export type JobCreationRequest = Partial<Omit<JobOffer, 'id' | 'isFeatured' | 'createdAt' | 'updatedAt'>>

export type JobOfferApiResponse = SingleApiResponse<JobOffer>

export type SaveJobOfferRequest = { user: number, jobOffer: number }

export type DeleteSavedJobOfferRequest = Pick<BookmarkedJobOffer, 'id'>

export enum SeniorityLevel {
    junior = "junior",
    senior = "senior",
    lead = "lead",
    medium = "medium",
}

export enum RemoteOptions {
    noRemote = "noRemote",
    fullRemote = "fullRemote",
    hybrid = "hybrid"
}

export enum WorkType {
    fullTime = 'full-time',
    partTime = 'part-time',
    freelance = 'freelance',
    contract = 'contract',
    internship = 'internship'
}

export interface JobSearchFilters {
    keyword?: string,
    remoteOption?: string,
    workType?: string
    seniorityLevel?: string,
    countries?: string[]
}