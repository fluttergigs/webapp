import {defineStore} from "pinia";
import {Endpoint} from "~/core/network/endpoints";
import {Wrapper} from "~/core/wrapper";
import {logDev} from "~/core/helpers/log";
import {MultiApiResponse, SingleApiResponse} from "~/core/shared/types";
import {AppStrings} from "~/core/strings";
import type {JobOffer} from "~/features/jobs/job.types";

// @ts-ignore
export const useJobStore = defineStore('job', {
    state: () => ({
        jobListResponse: new Wrapper<MultiApiResponse<JobOffer>>().toInitial(),
        selectedJob: Wrapper.getEmpty().toInitial(),
        jobCreation: new Wrapper<SingleApiResponse<JobOffer>>().toInitial(),
        jobFiltersResponse: new Wrapper<MultiApiResponse<JobOffer>>().toInitial(),

    }),
    actions: {
        async fetchJobs(): Promise<void> {
            try {
                // @ts-ignore
                this.jobListResponse = this.jobFiltersResponse = new Wrapper<MultiApiResponse<JobOffer>>().toLoading()
                const {$http} = useNuxtApp()
                const response = await (<HttpClient>$http).get(`${Endpoint.jobOffers}?populate=*`)
                // @ts-ignore
                this.jobListResponse = this.jobFiltersResponse = this.jobListResponse.toSuccess(response)
            } catch (e) {
                logDev('fetching companies error', e)
                this.jobListResponse = this.jobListResponse.toFailed(AppStrings.unableToFetchJobs)
            }
        },

        async filterJobs(): Promise<void> {
            this.jobFiltersResponse = new Wrapper<MultiApiResponse<JobOffer>>().toLoading()
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
        }
    },
    getters: {
        //@ts-ignore
        jobs: (state) => {
            return state.jobListResponse?.value?.data?.map((item: { [x: string]: any; }) => ({
                ...item['attributes'],
                id: item['id']
            }));
        },
        currentViewedJob: (state) => state.selectedJob.value,
        filteredJobs: (state) => state.jobFiltersResponse?.value?.data?.map((item: { [x: string]: any; }) => ({
            ...item['attributes'],
            id: item['id']
        }))
    },
    // persist: true,
})