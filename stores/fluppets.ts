import { defineStore } from 'pinia';
import { Wrapper } from '~/core/wrapper';
import type { MultiApiResponse } from '~/core/shared/types';
import type { Snippet } from '~/features/fluppets/fluppets.types';
import { HttpClient } from '~/core/network/http_client';
import { Endpoint } from '~/core/network/endpoints';
import { AppStrings } from '~/core/strings';

export const useFluppetsStore = defineStore('fluppets', {
  state: () => ({
    fluppetsListResponse: new Wrapper<MultiApiResponse<Snippet>>().toInitial(),
    filteredFluppetsListResponse: new Wrapper<MultiApiResponse<Snippet>>().toInitial(),
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
    async search() {
    },
  },
  getters: {
    fluppetsList: (state) => {
      return state.fluppetsListResponse.value?.data ?? [];
    },
    filteredFluppetsList: (state) => {
      return state.filteredFluppetsListResponse.value?.data ?? [];
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
