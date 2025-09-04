import { CompanySize } from '~/features/companies/company.types';
import { userFacingCompanySize } from '~/features/companies/transformers';
import { RemoteOptions, SeniorityLevel, WorkType } from '~/features/jobs/job.types';
import {
  userFacingRemoteOptions,
  userFacingSeniorityLevel,
  userFacingWorkType,
} from '~/features/jobs/transformers';

export const workTypeOptions = [
  {
    id: WorkType.fullTime,
    label: userFacingWorkType(WorkType.fullTime),
  },
  {
    id: WorkType.partTime,
    label: userFacingWorkType(WorkType.partTime),
  },
  {
    id: WorkType.freelance,
    label: userFacingWorkType(WorkType.freelance),
  },
  {
    id: WorkType.contract,
    label: userFacingWorkType(WorkType.contract),
  },
  {
    id: WorkType.internship,
    label: userFacingWorkType(WorkType.internship),
  },
];

export const seniorityLevelOptions = [
  {
    id: SeniorityLevel.junior,
    label: userFacingSeniorityLevel(SeniorityLevel.junior),
  },
  {
    id: SeniorityLevel.medium,
    label: userFacingSeniorityLevel(SeniorityLevel.medium),
  },
  {
    id: SeniorityLevel.senior,
    label: userFacingSeniorityLevel(SeniorityLevel.senior),
  },
  {
    id: SeniorityLevel.lead,
    label: userFacingSeniorityLevel(SeniorityLevel.lead),
  },
];

export const companySizeOptions = [
  {
    id: CompanySize.micro,
    label: userFacingCompanySize(CompanySize.micro),
  },
  {
    id: CompanySize.small,
    label: userFacingCompanySize(CompanySize.small),
  },
  {
    id: CompanySize.medium,
    label: userFacingCompanySize(CompanySize.medium),
  },
  {
    id: CompanySize.large,
    label: userFacingCompanySize(CompanySize.large),
  },
];

export const remoteOptions = [
  {
    id: RemoteOptions.hybrid,
    label: userFacingRemoteOptions(RemoteOptions.hybrid),
  },
  {
    id: RemoteOptions.fullRemote,
    label: userFacingRemoteOptions(RemoteOptions.fullRemote),
  },
  {
    id: RemoteOptions.noRemote,
    label: userFacingRemoteOptions(RemoteOptions.noRemote),
  },
];

export const defaultShimmerListItemsCount = 5;

export const COUNTRIES_API_ENDPOINT = 'https://restcountries.com/v3.1/all';

export const MAX_LANDING_PAGE_JOBS = 6;

export const APP_NAME = 'Flutter Gigs';

export const getPaymentPortalUrlForJobPosting = (email: string) =>
  `https://fluttergigs.fillout.com/pay-job-posting?email=${email}`;

export const MAX_JOBS_PER_PAGE = 4;

export const MAX_FLUPPETS_PER_PAGE = 4;

export const DAILY_FLUPPET_COPY_FOR_ANONYMOUS = 2;
