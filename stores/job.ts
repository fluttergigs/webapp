import {defineStore} from "pinia";
import {Endpoint} from "~/core/network/endpoints";
import {Wrapper} from "~/core/wrapper";
import {logDev} from "~/core/helpers/log";
import {MultiApiResponse, SingleApiResponse} from "~/core/shared/types";
import {AppStrings} from "~/core/strings";
import type {JobCreationRequest, JobOffer, JobOfferApiResponse, JobSearchFilters} from "~/features/jobs/job.types";
import type {HttpClient} from "~/core/network/http_client";
import {stringify} from "qs";
import {MAX_LANDING_PAGE_JOBS, remoteOptions, seniorityLevelOptions, workTypeOptions} from "~/core/constants";
import {GenerativeAIProvider} from "~/services/ai/generative_ai_provider";
import {generateJobOfferSlug} from "~/core/utils";
import {useAuthStore} from "~/stores/auth";

// @ts-ignore
export const useJobStore = defineStore('job', {
    state: () => ({
        jobListResponse: new Wrapper<MultiApiResponse<JobOffer>>().toInitial(),
        selectedJob: Wrapper.getEmpty().toInitial(),
        jobCreation: new Wrapper<SingleApiResponse<JobOffer>>().toInitial(),
        jobFiltersResponse: new Wrapper<MultiApiResponse<JobOffer>>().toInitial(),
        searchFilters: <JobSearchFilters>{},
        isJobDescriptionGenerationModalOpen: false,
        jobDescriptionTask: new Wrapper<String>().toInitial(),
        jobCreationData: <JobCreationRequest>{
            applyBefore: new Date(),
            workType: workTypeOptions[0].id,
            seniorityLevel: seniorityLevelOptions[0].id,
            remoteOptions: remoteOptions[0].id,
            company: useAuthStore().myCompany.id,
        }
    }),

    actions: {
        async generateJobDescription(prompt: string) {
            try {
                this.jobDescriptionTask = new Wrapper<String>().toLoading()
                const {$generativeAI} = useNuxtApp();
                const response = await (<GenerativeAIProvider>$generativeAI).generateText(prompt);
                this.jobCreationData.description = response;
                this.jobDescriptionTask = this.jobDescriptionTask.toSuccess(response, AppStrings.jobDescriptionIsReady)
            } catch (e) {
                this.jobDescriptionTask = this.jobDescriptionTask.toFailed(AppStrings.unableToGenerateJobDescription)
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
                ...filters
            }
        },

        async postJob() {
            try {
                this.jobCreation = new Wrapper<JobOfferApiResponse>().toLoading()
                const {$http} = useNuxtApp()
                this.jobCreationData.slug = generateJobOfferSlug({
                    jobTitle: this.jobCreationData.title,
                    companyName: useAuthStore().myCompany.name
                })
                const response = await (<HttpClient>$http).post(`${Endpoint.jobOffers}`, {data: this.jobCreationData})
                this.jobCreation = this.jobCreation.toSuccess(response, AppStrings.jobOfferPostedSuccessfully.replaceAll('{{title}}', this.jobCreationData.title))
                //TODO - think more on that
                this.resetJobCreationData()
            } catch (e) {
                logDev('create company error', e)
                this.jobCreation = this.jobCreation.toFailed(AppStrings.unableToCreateJobOffer)
            }
        },

        async fetchJobs(): Promise<void> {
            try {
                // @ts-ignore
                this.jobListResponse = this.jobFiltersResponse = new Wrapper<MultiApiResponse<JobOffer>>().toLoading()
                const {$http} = useNuxtApp()
                const response = await (<HttpClient>$http).get(`${Endpoint.jobOffers}?populate=*`)
                // @ts-ignore
                this.jobListResponse = this.jobFiltersResponse = this.jobListResponse.toSuccess(response)
            } catch (e) {
                logDev('fetching job offers error', e)
                this.jobListResponse = this.jobListResponse.toFailed(AppStrings.unableToFetchJobs)
            }
        },

        async filterJobs(): Promise<void> {
            try {
                const query = stringify({
                    populate: '*',
                    filters: {
                        ...(!!this.searchFilters.remoteOption && {
                            remoteOptions: {
                                $eq: this.searchFilters.remoteOption
                            }
                        }),
                        ...(!!this.searchFilters.seniorityLevel && {
                            seniorityLevel: {
                                $eq: this.searchFilters.seniorityLevel
                            }
                        }),
                        ...(!!this.searchFilters.workType && {
                            workType: {
                                $eq: this.searchFilters.workType
                            }
                        }),
                        ...(!!this.searchFilters.keyword && {
                            description: {
                                $containsi: this.searchFilters.keyword,
                            },
                            name: {
                                $containsi: this.searchFilters.keyword,
                            }
                        }),
                        ...(!!this.searchFilters.countries && {
                            workPermits: {
                                $containsi: this.searchFilters.countries
                            },
                        })
                    },
                    sort: 'createdAt:desc',
                }, {
                    encodeValuesOnly: true,
                })
                this.jobFiltersResponse = new Wrapper<MultiApiResponse<JobOffer>>().toLoading()
                const {$http} = useNuxtApp()
                const response = await (<HttpClient>$http).get(`${Endpoint.jobOffers}?${query}`)
                // @ts-ignore
                this.jobFiltersResponse = this.jobFiltersResponse.toSuccess(response)
            } catch (e) {
                this.jobFiltersResponse = this.jobFiltersResponse.toFailed(AppStrings.unableToFetchJobs)
            }
        },

        async setSelectedJob(job: JobOffer) {
            logDev('SETTING VIEWED JOB')
            this.selectedJob = new Wrapper().toSuccess(job)
            logDev('SETTING VIEWED JOB -- DONE')
        },

        async findJobById(job: JobOffer): Promise<void> {
            try {
                //@ts-ignore
                this.selectedJob = new Wrapper().toLoading(job)
                const {$http} = useNuxtApp()
                const response = await (<HttpClient>$http).get(`${Endpoint.jobOffers}/${job.id}?populate=*`)
                //@ts-ignore
                this.selectedJob = this.selectedJob.toSuccess(response)
                logDev('single Job RESPONSE', response)
            } catch (e) {
                this.selectedJob = this.selectedJob.toSuccess(job, AppStrings.unableToFetchJob)
            }
        },
        resetJobCreationData() {
            this.jobCreationData = <JobCreationRequest>{
                applyBefore: new Date(),
                workType: workTypeOptions[0].id,
                seniorityLevel: seniorityLevelOptions[0].id,
                remoteOptions: remoteOptions[0].id,
            }
        }
    },
    getters: {
        //@ts-ignore
        jobs: (state) =>
            state.jobListResponse?.value?.data?.map((item: { [x: string]: any; }) => ({
                ...item['attributes'],
                id: item['id']
            })),
        currentViewedJob: (state) => state.selectedJob.value,
        filteredJobs: (state) => state.jobFiltersResponse?.value?.data?.map((item: { [x: string]: any; }) => ({
            ...item['attributes'],
            id: item['id']
        })),
        landingPageJobs: state => {
            const jobs = useJobStore().jobs as JobOffer[]
            return jobs?.length > MAX_LANDING_PAGE_JOBS ? jobs?.slice(0, MAX_LANDING_PAGE_JOBS - 1) : jobs;
        }
    },
    // persist: true,
    persist:
        {
            paths: ["selectedJob"],
            storage: persistedState.localStorage,
            debug: import.meta.env.MODE === "development"
        }
})