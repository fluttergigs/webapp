import { defineStore } from 'pinia';
import { logDev } from '~/core/helpers/log'; // @ts-ignore
import { Wrapper } from '~/core/wrapper';
import { MultiApiResponse, SingleApiResponse } from '~/core/shared/types';
import { Endpoint } from '~/core/network/endpoints';
import { AppStrings } from '~/core/strings';
import type { HttpClient } from '~/core/network/http_client';
import {
  BookmarkedJobOffer,
  DeleteSavedJobOfferRequest,
  JobOffer,
  SaveJobOfferRequest,
} from '~/features/jobs/job.types'; // @ts-ignore
import isBefore from 'date-fns/isBefore'; // @ts-ignore
import parseISO from 'date-fns/parseISO'; // @ts-ignore
import isAfter from 'date-fns/isAfter';
import { useAuthStore } from '~/stores/auth'; //@ts-ignore

//@ts-ignore
export const useUserStore = defineStore('user', {
  state: () => ({
    bookmarkedJobsListResponse: new Wrapper<
      MultiApiResponse<BookmarkedJobOffer>
    >().toInitial(),
    bookmarkedJobCreation: new Wrapper<
      SingleApiResponse<BookmarkedJobOffer>
    >().toInitial(),
    bookmarkedJobDelete: new Wrapper<SingleApiResponse<Object>>().toInitial(),
    jobToBookmark: -1,
  }),
  actions: {
    // Save a job to bookmarks
    async saveJob(request: SaveJobOfferRequest): Promise<void> {
      this.bookmarkedJobCreation = new Wrapper<SingleApiResponse<BookmarkedJobOffer>>().toInitial();
      const { $http } = useNuxtApp();

      try {
        const response = await (<HttpClient>$http).post<
          SingleApiResponse<BookmarkedJobOffer>
        >(Endpoint.bookmarkedJobOffers, { data: request });
        this.bookmarkedJobCreation = this.bookmarkedJobCreation.toSuccess(
          response,
          AppStrings.jobOfferSavedSuccessfully,
        );
      } catch (error) {
        logDev('Error saving job offer', error);
        this.bookmarkedJobCreation = this.bookmarkedJobCreation.toFailed(
          AppStrings.unableToSaveJob,
        );
      }
    },

    // Remove a saved job from bookmarks
    async deleteSavedJob(request: DeleteSavedJobOfferRequest): Promise<void> {
      this.bookmarkedJobDelete = new Wrapper<SingleApiResponse<Object>>().toLoading();
      const { $http } = useNuxtApp();

      try {
        const response = await (<HttpClient>$http).delete<SingleApiResponse<object>>(`${Endpoint.bookmarkedJobOffers}/${request.id}`);
        this.bookmarkedJobDelete = this.bookmarkedJobDelete.toSuccess(
          response,
          AppStrings.jobOfferRemovedFromBookmarksSuccessfully,
        );
      } catch (error) {
        logDev('Error deleting saved job offer', error);
        this.bookmarkedJobDelete = this.bookmarkedJobDelete.toFailed(
          AppStrings.unableToRemoveSavedJob,
        );
      }
    },

    // Fetch all bookmarked job offers
    async fetchBookmarkedJobOffers(): Promise<void> {
      this.bookmarkedJobsListResponse = new Wrapper<MultiApiResponse<BookmarkedJobOffer>>().toLoading();
      const { $http } = useNuxtApp();

      try {
        const response = await (<HttpClient>$http).get<
          MultiApiResponse<BookmarkedJobOffer>
        >(Endpoint.bookmarkedJobOffers);
        this.bookmarkedJobsListResponse =
          this.bookmarkedJobsListResponse.toSuccess(response);
      } catch (error) {
        logDev('Error fetching bookmarked job offers', error);
        this.bookmarkedJobsListResponse =
          this.bookmarkedJobsListResponse.toFailed(
            AppStrings.unableToFetchJobs,
          );
      }
    },
  },
  getters: {
    activeBookmarkedJobs: (state) =>
      useUserStore().bookmarkedJobs?.filter((job: JobOffer) =>
        isAfter(parseISO(job.applyBefore.toString()), new Date()),
      ),

    bookmarkedJobs: (state) =>
      state.bookmarkedJobsListResponse?.value?.data ?? [],

    companies: (state) => useAuthStore().authUser?.companies ?? [],

    expiredBookmarkedJobs: (state) =>
      useUserStore().bookmarkedJobs?.filter((job: JobOffer) =>
        isBefore(parseISO(job.applyBefore.toString()), new Date()),
      ),

    isHandlingBookmark: (state) =>
      (
        state.bookmarkedJobCreation.isLoading ||
        state.bookmarkedJobDelete.isLoading
      ),

    hasCompanies: (state) => useUserStore().companies.length > 0,

    myCompany: (state) =>
      useUserStore().hasCompanies ? useUserStore().companies[0] : null,

    educations: (state) => {
      const educations = useUserStore().authUser?.educations ?? [];
      return educations.filter((education: { endDate: string }) =>
        isAfter(parseISO(education.endDate), new Date()),
      );
    },
    hasEducations: (state) => useUserStore().educations.length > 0,
    employments: (state) => {
      const employments = useUserStore().authUser?.employments ?? [];
      return employments.filter((employment: { endDate: string }) =>
        isAfter(parseISO(employment.endDate), new Date()),
      );
    },
    hasEmployments: (state) => useUserStore().employments.length > 0,
  },
});
