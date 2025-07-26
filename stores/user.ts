import { defineStore } from 'pinia';
import { logDev } from '~/core/helpers/log'; // @ts-ignore
import { Wrapper } from '~/core/wrapper';
import type { MultiApiResponse, SingleApiResponse } from '~/core/shared/types';
import { Endpoint } from '~/core/network/endpoints';
import { AppStrings } from '~/core/strings';
import type { HttpClient } from '~/core/network/http_client';
import type { BookmarkedJobOffer, DeleteSavedJobOfferRequest, SaveJobOfferRequest } from '~/features/jobs/job.types'; // @ts-ignore
import isBefore from 'date-fns/isBefore'; // @ts-ignore
import parseISO from 'date-fns/parseISO'; // @ts-ignore
import isAfter from 'date-fns/isAfter';
import { useAuthStore } from '~/stores/auth';
import type {
  AddEducationRequest,
  AddExperienceRequest,
  Education,
  Experience,
  UpdateEducationRequest,
  UpdateExperienceRequest,
} from '~/features/users/user.types'; //@ts-ignore

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
    $addExperience: new Wrapper<SingleApiResponse<Experience>>().toInitial(),
    $addEducation: new Wrapper<SingleApiResponse<Education>>().toInitial(),
    $deleteExperience: new Wrapper<SingleApiResponse<Object>>().toInitial(),
    $deleteEducation: new Wrapper<SingleApiResponse<Object>>().toInitial(),
    $updateExperience: new Wrapper<SingleApiResponse<Experience>>().toInitial(),
    $updateEducation: new Wrapper<SingleApiResponse<Education>>().toInitial(),
  }),
  actions: {
    // Save a job to bookmarks
    async saveJob(request: SaveJobOfferRequest): Promise<void> {
      this.bookmarkedJobCreation = new Wrapper<SingleApiResponse<BookmarkedJobOffer>>().toInitial();
      const { $http } = useNuxtApp();

      try {
        const response = await (<HttpClient>$http).post<SingleApiResponse<BookmarkedJobOffer>>(Endpoint.bookmarkedJobOffers, { data: request });
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

    // Add experience
    async addExperience(request: AddExperienceRequest): Promise<void> {
      this.$addExperience = new Wrapper<SingleApiResponse<Experience>>().toLoading();
      const { $http } = useNuxtApp();

      try {
        const response = await (<HttpClient>$http).post<SingleApiResponse<Experience>>(Endpoint.experiences, { ...request });
        this.$addExperience = this.$addExperience.toSuccess(
          response,
          AppStrings.experienceAddedSuccessfully,
        );
      } catch (error) {
        logDev('Error adding experience', error);
        this.$addExperience = this.$addExperience.toFailed(
          AppStrings.unableToAddExperience,
        );
      }
    },

    //Delete experience
    async deleteExperience(experienceId: string): Promise<void> {
      this.$deleteExperience = new Wrapper<SingleApiResponse<Object>>().toLoading();
      const { $http } = useNuxtApp();

      try {
        const response = await (<HttpClient>$http).delete<SingleApiResponse<Object>>(
          `${Endpoint.experiences}/${experienceId}`,
        );
        this.$deleteExperience = this.$deleteExperience.toSuccess(
          response,
          AppStrings.experienceDeletedSuccessfully,
        );
      } catch (error) {
        logDev('Error deleting experience', error);
        this.$deleteExperience = this.$deleteExperience.toFailed(
          AppStrings.unableToDeleteExperience,
        );
      }
    },

    async deleteEducation(educationId: string): Promise<void> {
      this.$deleteEducation = new Wrapper<SingleApiResponse<Object>>().toLoading();
      const { $http } = useNuxtApp();

      try {
        const response = await (<HttpClient>$http).delete<SingleApiResponse<Object>>(
          `${Endpoint.educations}/${educationId}`,
        );
        this.$deleteEducation = this.$deleteEducation.toSuccess(
          response,
          AppStrings.experienceDeletedSuccessfully,
        );
      } catch (error) {
        logDev('Error deleting experience', error);
        this.$deleteEducation = this.$deleteEducation.toFailed(
          AppStrings.unableToDeleteExperience,
        );
      }
    },

    // Add education
    async addEducation(request: AddEducationRequest): Promise<void> {
      this.$addEducation = new Wrapper<SingleApiResponse<Education>>().toLoading();
      const { $http } = useNuxtApp();

      try {
        const response = await (<HttpClient>$http).post<
          SingleApiResponse<Education>
        >(Endpoint.educations, { ...request });
        this.$addEducation = this.$addEducation.toSuccess(
          response,
          AppStrings.educationAddedSuccessfully,
        );
      } catch (error) {
        logDev('Error adding education', error);
        this.$addEducation = this.$addEducation.toFailed(
          AppStrings.unableToAddEducation,
        );
      }
    },

    // Update experience
    /**
     * Updates an existing experience with the provided data.
     *
     * @param {UpdateExperienceRequest} request - The data used to update the experience.
     * @param {string} id - The unique identifier of the experience to update.
     * @return {Promise<void>} A promise that resolves when the experience has been updated or rejects if an error occurs.
     */
    async updateExperience(request: UpdateExperienceRequest, id: string): Promise<void> {
      this.$updateExperience = new Wrapper<SingleApiResponse<Experience>>().toLoading();
      const { $http } = useNuxtApp();

      try {
        const response = await (<HttpClient>$http).put<SingleApiResponse<Experience>>(
          `${Endpoint.experiences}/${id}`,
          { ...request },
        );
        this.$updateExperience = this.$updateExperience.toSuccess(
          response,
          AppStrings.experienceAddedSuccessfully,
        );
      } catch (error) {
        logDev('Error updating experience', error);
        this.$updateExperience = this.$updateExperience.toFailed(
          AppStrings.unableToUpdateExperience,
        );
      }
    },

    // Update education
    async updateEducation(request: UpdateEducationRequest, id: string): Promise<void> {
      this.$updateEducation = new Wrapper<SingleApiResponse<Education>>().toLoading();
      const { $http } = useNuxtApp();

      try {
        const response = await (<HttpClient>$http).put<SingleApiResponse<Education>>(
          `${Endpoint.educations}/${id}`,
          { ...request },
        );
        this.$updateEducation = this.$updateEducation.toSuccess(
          response,
          AppStrings.educationAddedSuccessfully,
        );
      } catch (error) {
        logDev('Error updating education', error);
        this.$updateEducation = this.$updateEducation.toFailed(
          AppStrings.unableToUpdateEducation,
        );
      }
    },

    async updateOverviewData(request: UpdateOverviewDataRequest): Promise<void> {
      this.$updateOverviewData = new Wrapper<SingleApiResponse<Object>>().toLoading();
      const { $http } = useNuxtApp();

      try {
        const response = await (<HttpClient>$http).put<SingleApiResponse<Object>>(
          `${Endpoint.users}/${request.data.user}`,
          { ...request },
        );
        this.$updateOverviewData = this.$updateOverviewData.toSuccess(
          response,
          AppStrings.dataUpdatedSuccessfully,
        );
      } catch (error) {
        logDev('Error updating overview data', error);
        this.$updateOverviewData = this.$updateOverviewData.toFailed(
          AppStrings.unableToUpdateYourData,
        );
      }
    },
  },
  getters: {
    bookmarkedJobs: (state) =>
      state.bookmarkedJobsListResponse?.value?.data ?? [],

    activeBookmarkedJobs: (state) =>
      useUserStore().bookmarkedJobs?.filter(({ applyBefore }) =>
        isAfter(parseISO(applyBefore.toString()), new Date()),
      ) ?? [],

    expiredBookmarkedJobs: (state) =>
      useUserStore().bookmarkedJobs?.filter(({ applyBefore }) =>
        isBefore(parseISO(job.applyBefore.toString()), new Date()),
      ) ?? [],

    companies: (state) => useAuthStore().authUser?.companies ?? [],


    isHandlingBookmark: (state) =>
    (
      state.bookmarkedJobCreation.isLoading ||
      state.bookmarkedJobDelete.isLoading
    ),

    hasCompanies: (state) => useUserStore().companies.length > 0,

    myCompany: (state) =>
      useUserStore().hasCompanies ? useUserStore().companies[0] : null,

    educations: (state) => {
      const educations = useAuthStore().authUser?.educations ?? [];

      //filter out duplicate educations
      return educations.filter((education, index, self) =>
        index === self.findIndex((e) => e.documentId === education.documentId),
      );
    },
    hasEducations: (state) => useUserStore().educations.length > 0,
    experiences: (state) => {
      const experiences: Experience[] = useAuthStore().authUser?.experiences ?? [];

      //filter out duplicate experiences
      const uniqueExperiences = experiences.filter((experience, index, self) =>
        index === self.findIndex((e) => e.documentId === experience.documentId),
      );
      //sort experiences by end date in descending order
      return uniqueExperiences.sort((a, b) => {
        if (a.endDate && b.endDate) {
          return (
            new Date(b.endDate).getTime() - new Date(a.endDate).getTime()
          );
        } else if (a.endDate) {
          return -1;
        } else if (b.endDate) {
          return 1;
        }
        return 0;
      });
    },
    hasExperiences: (state) => useUserStore().experiences.length > 0,
  },
});
