import {JobOffer, RemoteOptions, SeniorityLevel, WorkType} from "~/features/jobs/job.types";
import type {Company, CompanyApiResponse} from "~/features/companies/company.types";

export function userFacingWorkType(workType: WorkType) {
    switch (workType) {
        case WorkType.contract:
            return 'Contract';
        case WorkType.freelance:
            return 'Freelance';
        case WorkType.fullTime:
            return 'Full time';
        case WorkType.internship:
            return 'Internship';
        case WorkType.partTime:
            return 'Part time'
    }
}

export function userFacingRemoteOptions(remote: RemoteOptions) {
    switch (remote) {
        case RemoteOptions.fullRemote:
            return 'Full remote';
        case RemoteOptions.noRemote:
            return 'Remote not allowed';
        case RemoteOptions.hybrid:
            return 'Hybrid';
    }
}

export function userFacingSeniorityLevel(level: SeniorityLevel) {
    switch (level) {
        case SeniorityLevel.junior:
            return 'Junior';
        case SeniorityLevel.lead:
            return 'Lead';
        case SeniorityLevel.medium:
            return 'Medium';
        case SeniorityLevel.senior:
            return 'Senior';
    }
}

export const extractCompanyFromJob = (job: JobOffer) => <Company>({
    ...(job?.company as CompanyApiResponse)?.data['attributes'],
    id: (job?.company as CompanyApiResponse)?.data['id']
});