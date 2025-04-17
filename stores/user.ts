import {defineStore} from "pinia";
import {logDev} from "~/core/helpers/log";
// @ts-ignore
import {Wrapper} from "~/core/wrapper";
import {MultiApiResponse, SingleApiResponse} from "~/core/shared/types";
import {Endpoint} from "~/core/network/endpoints";
import {AppStrings} from "~/core/strings";
import type {HttpClient} from "~/core/network/http_client";
import {BookmarkedJobOffer, DeleteSavedJobOfferRequest, JobOffer, SaveJobOfferRequest} from "~/features/jobs/job.types";
// @ts-ignore
import isBefore from "date-fns/isBefore";
// @ts-ignore
import parseISO from "date-fns/parseISO";
// @ts-ignore
import isAfter from "date-fns/isAfter";
import {useAuthStore} from "~/stores/auth";

//@ts-ignore
export const useUserStore = defineStore('user', {
    state: () => ({
        bookmarkedJobsListResponse: new Wrapper<MultiApiResponse<BookmarkedJobOffer>>().toInitial(),
        bookmarkedJobCreation: new Wrapper<SingleApiResponse<BookmarkedJobOffer>>().toInitial(),
        bookmarkedJobDelete: new Wrapper<SingleApiResponse<Object>>().toInitial(),
        jobToBookmark: -1,
    }),
    actions: {
        async saveJob(request: SaveJobOfferRequest) {
            try {
                this.bookmarkedJobCreation = new Wrapper<SingleApiResponse<BookmarkedJobOffer>>().toLoading()
                const {$http} = useNuxtApp()

                const response: SingleApiResponse<BookmarkedJobOffer> = await (<HttpClient>$http).post(`${Endpoint.bookmarkedJobOffers}`, {data: request})
                this.bookmarkedJobCreation = this.bookmarkedJobCreation.toSuccess(response, AppStrings.jobOfferSavedSuccessfully)
            } catch (e) {
                logDev('saving job offer error', e)
                this.bookmarkedJobCreation = this.bookmarkedJobCreation.toFailed(AppStrings.unableToSaveJob)
            }
        },

        async deleteSavedJob(request: DeleteSavedJobOfferRequest) {
            try {
                this.bookmarkedJobDelete = new Wrapper<SingleApiResponse<Object>>().toLoading()
                const {$http} = useNuxtApp()

                const response: SingleApiResponse<Object> = await (<HttpClient>$http).delete(`${Endpoint.bookmarkedJobOffers}/${request.id}`)
                this.bookmarkedJobDelete = this.bookmarkedJobDelete.toSuccess(response, AppStrings.jobOfferRemovedFromBookmarksSuccessfully)
            } catch (e) {
                logDev('deleting saved job offer error', e)
                this.bookmarkedJobDelete = this.bookmarkedJobDelete.toFailed(AppStrings.unableToRemoveSavedJob)
            }
        },

        async fetchBookmarkedJobOffers(): Promise<void> {
            try {
                // @ts-ignore
                this.bookmarkedJobsListResponse = new Wrapper<MultiApiResponse<BookmarkedJobOffer>>().toLoading()
                const {$http} = useNuxtApp()
                const response = await (<HttpClient>$http).get(`${Endpoint.bookmarkedJobOffers}`)
                // @ts-ignore
                this.bookmarkedJobsListResponse = this.bookmarkedJobsListResponse.toSuccess(response)
            } catch (e) {
                logDev('fetching bookmarked job offers error', e)
                this.bookmarkedJobsListResponse = this.bookmarkedJobsListResponse.toFailed(AppStrings.unableToFetchJobs)
            }
        },
    },
    getters: {
        activeBookmarkedJobs: state => useUserStore().bookmarkedJobs?.filter((job: JobOffer) => isAfter(parseISO(job.applyBefore), new Date())),

        bookmarkedJobs: (state) => state.bookmarkedJobsListResponse?.value?.data ?? [],

        companies: state => useAuthStore().authUser?.companies ?? [],

        expiredBookmarkedJobs: state => useUserStore().bookmarkedJobs?.filter((job: JobOffer) => isBefore(parseISO(job.applyBefore), new Date())),

        isHandlingBookmark: state => !!(state.bookmarkedJobCreation.isLoading || state.bookmarkedJobDelete.isLoading),

        hasCompanies: (state) => (useUserStore().companies.length > 0),

        myCompany: (state) => useUserStore().hasCompanies ? useUserStore().companies[0] : null,


        educations: (state) => {
            const educations = useUserStore().authUser?.educations ?? []
            return educations.filter((education: {
                endDate: string
            }) => isAfter(parseISO(education.endDate), new Date()))
        },
        hasEducations: (state) => useUserStore().educations.length > 0,
        employments: (state) => {
            const employments = useUserStore().authUser?.employments ?? []
            return employments.filter((employment: {
                endDate: string
            }) => isAfter(parseISO(employment.endDate), new Date()))
        },
        hasEmployments: (state) => useUserStore().employments.length > 0,

    },
})