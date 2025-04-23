import { defineStore } from 'pinia';
// @ts-ignore
import { Endpoint } from '~/core/network/endpoints';
import { Wrapper } from '~/core/wrapper';
import { logDev } from '~/core/helpers/log';
import type { MultiApiResponse, SingleApiResponse } from '~/core/shared/types';
import { AppStrings } from '~/core/strings';
import type {
  JobCreationRequest,
  JobOffer,
  JobOfferApiResponse,
  JobOfferDeleteRequest,
  JobOfferEditRequest,
  JobSearchFilters,
} from '~/features/jobs/job.types';
import type { HttpClient } from '~/core/network/http_client';
import { stringify } from 'qs';
import { MAX_LANDING_PAGE_JOBS, remoteOptions, seniorityLevelOptions, workTypeOptions } from '~/core/constants';
import { GenerativeAIProvider } from '~/services/ai/GenerativeAIProvider';

// @ts-ignore
export const useJobStore = defineStore('job', {
  state: () => ({
    jobListResponse: new Wrapper<MultiApiResponse<JobOffer>>().toInitial(),
    selectedJob: Wrapper.getEmpty().toInitial(),
    jobCreation: new Wrapper<SingleApiResponse<JobOffer>>().toInitial(),
    jobFiltersResponse: new Wrapper<MultiApiResponse<JobOffer>>().toInitial(),
    searchFilters: <JobSearchFilters>{},
    isJobDescriptionGenerationModalOpen: false,
    jobDescriptionGenerationTask: new Wrapper<String>().toInitial(),
    jobDelete: new Wrapper<SingleApiResponse<Object>>().toInitial(),
    jobEdit: new Wrapper<SingleApiResponse<Object>>().toInitial(),
    jobCreationData: <JobCreationRequest>{
      applyBefore: new Date(),
      workType: workTypeOptions[0].id,
      seniorityLevel: seniorityLevelOptions[0].id,
      remoteOptions: remoteOptions[0].id,
      company: useUserStore()?.myCompany?.id,
      hasPaid: false,
    },
    jobEditData: <JobOfferEditRequest>{},
  }),

  actions: {
    async generateJobDescription(prompt: string) {
      this.jobDescriptionGenerationTask = new Wrapper<String>().toLoading();
      try {
        //@ts-ignore
        const { $generativeAI } = useNuxtApp();
        const response = await (<GenerativeAIProvider>$generativeAI).generateText(prompt);
        this.jobCreationData.description = response as string;
        //@ts-ignore
        this.jobDescriptionGenerationTask = this.jobDescriptionGenerationTask.toSuccess(response as String, AppStrings.jobDescriptionIsReady);
      } catch (e) {
        this.jobDescriptionGenerationTask = this.jobDescriptionGenerationTask.toFailed(AppStrings.unableToGenerateJobDescription);
        throw e;
      }
    },
    hideJobDescriptionGenerationModal() {
      this.isJobDescriptionGenerationModalOpen = false;
    },
    showJobDescriptionGenerationModal() {
      this.isJobDescriptionGenerationModalOpen = true;
    },
    async setJobSearchFilters(filters: JobSearchFilters) {
      this.searchFilters = {
        ...this.searchFilters,
        ...filters,
      };
    },
    setJobCreationData(data: JobCreationRequest) {
      this.jobCreationData = {
        ...this.jobCreationData,
        ...data,
      };
    },
    setJobEditData(data: JobOfferEditRequest) {
      this.jobEditData = {
        ...this.jobEditData,
        ...data,
      };
    },
    clearJobEditData() {
      this.jobEditData = <JobOfferEditRequest>{};
    },

    async postJob() {
      this.jobCreation = new Wrapper<JobOfferApiResponse>().toLoading();
      try {
        //@ts-ignore
        const { $http } = useNuxtApp();
        /* //@ts-ignore
         this.jobCreationData.slug = generateJobOfferSlug({
             jobTitle: this.jobCreationData.title,
             companyName: useUserStore().myCompany.name
         })*/
        this.jobCreationData.company = useUserStore()?.myCompany?.id;

        const response = await (<HttpClient>$http).post<JobOfferApiResponse>(`${Endpoint.jobOffers}`, { data: this.jobCreationData });
        this.jobCreation = this.jobCreation.toSuccess(response, AppStrings.jobOfferPostedSuccessfully.replaceAll('{{title}}', <string>this.jobCreationData.title));
        //TODO - think more on that
        this.resetJobCreationData();
      } catch (e) {
        logDev('create company error', e);
        this.jobCreation = this.jobCreation.toFailed(AppStrings.unableToCreateJobOffer);
      }
    },

    async fetchJobs(): Promise<void> {
      this.jobListResponse = this.jobFiltersResponse = new Wrapper<MultiApiResponse<JobOffer>>().toLoading();
      try {
        // @ts-ignore
        const { $http } = useNuxtApp();
        const response = await (<HttpClient>$http).get(`${Endpoint.jobOffers}?populate=*`);
        // @ts-ignore
        this.jobListResponse = this.jobFiltersResponse = this.jobListResponse.toSuccess(response);
      } catch (e) {
        logDev('fetching job offers error', e);
        this.jobListResponse = this.jobFiltersResponse = this.jobListResponse.toFailed(AppStrings.unableToFetchJobs);
      }
    },

    async filterJobs(): Promise<void> {
      this.jobFiltersResponse = new Wrapper<MultiApiResponse<JobOffer>>().toLoading();
      try {
        const query = stringify({
          populate: '*',
          filters: {
            ...(!!this.searchFilters.remoteOption && {
              remoteOptions: {
                $eq: this.searchFilters.remoteOption,
              },
            }),
            ...(!!this.searchFilters.seniorityLevel && {
              seniorityLevel: {
                $eq: this.searchFilters.seniorityLevel,
              },
            }),
            ...(!!this.searchFilters.workType && {
              workType: {
                $eq: this.searchFilters.workType,
              },
            }),
            ...(!!this.searchFilters.keyword && {
              description: {
                $containsi: this.searchFilters.keyword,
              },
              name: {
                $containsi: this.searchFilters.keyword,
              },
            }),
            ...(!!this.searchFilters.countries && {
              workPermits: {
                $containsi: this.searchFilters.countries,
              },
            }),
          },
          sort: 'createdAt:desc',
        }, {
          encodeValuesOnly: true,
        });
        //@ts-ignore
        const { $http } = useNuxtApp();
        const response = await (<HttpClient>$http).get(`${Endpoint.jobOffers}?${query}`);
        // @ts-ignore
        this.jobFiltersResponse = this.jobFiltersResponse.toSuccess(response);
      } catch (e) {
        this.jobFiltersResponse = this.jobFiltersResponse.toFailed(AppStrings.unableToFetchJobs);
      }
    },
    async editJobOffer(job: JobOffer) {
      this.jobEdit = new Wrapper<SingleApiResponse<Object>>().toLoading();
      try {
        const { $http } = useNuxtApp();
        const response = await (<HttpClient>$http).put<SingleApiResponse<Object>>(`${Endpoint.jobOffers}/${job.id}`, { data: this.jobEditData });
        this.jobEdit = this.jobEdit.toSuccess(response, AppStrings.jobOfferUpdatedSuccessfully);
      } catch (e) {
        logDev('job offer edit error', e);
        this.jobEdit = this.jobCreation.toFailed(AppStrings.unableToEditJobOffer);
      }
    },

    async deleteJob(request: JobOfferDeleteRequest) {
      this.jobDelete = new Wrapper<SingleApiResponse<Object>>().toLoading();
      try {
        const { $http } = useNuxtApp();
        const response = await (<HttpClient>$http).delete<SingleApiResponse<Object>>(`${Endpoint.jobOffers}/${request.jobOffer}`);

        this.jobDelete = this.jobDelete.toSuccess(response, AppStrings.jobOfferDeletedSuccessfully);

      } catch (e) {
        logDev('delete company error', e);

        this.jobDelete = this.jobDelete.toFailed(AppStrings.unableToDeleteJobOffer);
      }
    },

    async setSelectedJob(job: JobOffer) {
      logDev('SETTING VIEWED JOB');
      //@ts-ignore
      this.selectedJob = new Wrapper().toSuccess(job);
      logDev('SETTING VIEWED JOB -- DONE');
    },

    async findJobById(job: JobOffer): Promise<void> {
      this.selectedJob = new Wrapper().toLoading(job);
      try {
        //@ts-ignore
        const { $http } = useNuxtApp();
        const response = await (<HttpClient>$http).get(`${Endpoint.jobOffers}/${job.id}?populate=*`);
        //@ts-ignore
        this.selectedJob = this.selectedJob.toSuccess(response);
        logDev('single Job RESPONSE', response);
      } catch (e) {
        //@ts-ignore
        this.selectedJob = this.selectedJob.toSuccess(job, AppStrings.unableToFetchJob);
      }
    },
    resetJobCreationData() {
      this.jobCreationData = <JobCreationRequest>{
        applyBefore: new Date(),
        workType: workTypeOptions[0].id,
        seniorityLevel: seniorityLevelOptions[0].id,
        remoteOptions: remoteOptions[0].id,
      };
    },
  },
  getters: {
    //@ts-ignore
    jobs: (state) =>
      state.jobListResponse?.value?.data?.reverse(),
    currentViewedJob: (state) => state.selectedJob.value,
    filteredJobs: (state) => state.jobFiltersResponse?.value?.data?.reverse(),
    landingPageJobs: (state) => {
      const jobs = useJobStore().jobs as JobOffer[];
      return jobs?.length > MAX_LANDING_PAGE_JOBS ? jobs?.slice(0, MAX_LANDING_PAGE_JOBS - 1) : jobs;
    },
  },
  // persist: true,
  persist:
    {
      paths: ['selectedJob', 'jobEditData', 'jobCreationData'],
      storage: persistedState.localStorage,
      debug: import.meta.env.MODE === 'development',
    },
});