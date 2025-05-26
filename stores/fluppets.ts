import { defineStore } from 'pinia';
import { Wrapper } from '~/core/wrapper';
import type { MultiApiResponse } from '~/core/shared/types';
import type { Snippet, Snippets, Tag, Tags } from '~/features/fluppets/fluppets.types';
import { HttpClient } from '~/core/network/http_client';
import { Endpoint } from '~/core/network/endpoints';
import { AppStrings } from '~/core/strings';

export const useFluppetsStore = defineStore('fluppets', {
  state: () => ({
    fluppetsListResponse: new Wrapper<MultiApiResponse<Snippet>>().toInitial(),
    filteredFluppetsListResponse: new Wrapper<MultiApiResponse<Snippet>>().toInitial(),
    fluppetTags: new Wrapper<MultiApiResponse<Tag>>().toInitial(),
  }),
  actions: {
    async load() {
      this.fluppetsListResponse = (this.filteredFluppetsListResponse =
        new Wrapper<MultiApiResponse<Snippet>>().toLoading());

      try {
        //@ts-ignore
        const { $http } = useNuxtApp();
        const response: MultiApiResponse<Snippet> = await (<HttpClient>$http).get(
          `${Endpoint.snippets}?populate=*`,
        );
        this.fluppetsListResponse = this.filteredFluppetsListResponse =
          this.fluppetsListResponse.toSuccess(response);
      } catch (e) {
        this.fluppetsListResponse = this.filteredFluppetsListResponse =
          this.fluppetsListResponse.toFailed(AppStrings.unableToFetchFluppets);
      }
    },

    async loadTags() {
      this.fluppetTags = new Wrapper<MultiApiResponse<Tag>>().toLoading();

      console.log('Fetching tags');
      try {
        //@ts-ignore
        const { $http } = useNuxtApp();
        const response: MultiApiResponse<Tag> = await (<HttpClient>$http).get(
          `${Endpoint.tags}?populate=*`,
        );
        this.fluppetTags = this.fluppetTags.toSuccess(response);
      } catch (e) {
        this.fluppetTags = this.fluppetTags.toFailed(AppStrings.unableToFetchTags);
      }
    },
    async search() {
    },
  },
  getters: {
    fluppetsList: (state) => {
      return (state.fluppetsListResponse.value?.data as Snippets) ?? [];
    },
    tags: (state) => {
      return (state.fluppetTags.value?.data as Tags) ?? [];
    },
    filteredFluppetsList: (state) => {
      return (state.filteredFluppetsListResponse.value?.data as Snippets) ?? [];
    },
    isFluppetTagsLoading: (state) => {
      return state.fluppetTags.isLoading;
    },
    isFluppetTagsError: (state) => {
      return state.fluppetTags.isFailure;
    },
    isFluppetTagsSuccess: (state) => {
      return state.fluppetTags.isSuccess;
    },
    isFluppetsListLoading: (state) => {
      return state.filteredFluppetsListResponse.isLoading;
    },
    isFluppetsListError: (state) => {
      return state.filteredFluppetsListResponse.isFailure;
    },
    isFluppetsListSuccess: (state) => {
      return state.filteredFluppetsListResponse.isSuccess;
    },
  },
});
