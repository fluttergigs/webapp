import type {CompanyApiResponse} from "~/features/companies/company.types";

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
    company: CompanyApiResponse,
    workPermits: string[] | null,
}

export type JobCreationRequest = Omit<JobOffer, 'id' | 'company' | 'isFeatured'>

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
}