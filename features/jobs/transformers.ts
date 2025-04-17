import {RemoteOptions, SeniorityLevel, WorkType} from "~/features/jobs/job.types";

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
        case WorkType.selfEmployed:
            return 'Self employed';
        default:
            return WorkType.fullTime;
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
        default:
            return RemoteOptions.fullRemote;
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
        default:
            return SeniorityLevel.medium;
    }
}
