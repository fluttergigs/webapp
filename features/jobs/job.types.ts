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
}

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