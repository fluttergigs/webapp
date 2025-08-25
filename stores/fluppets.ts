import { defineStore } from 'pinia';
import { Wrapper } from '~/core/wrapper';
import type { MultiApiResponse, SingleApiResponse } from '~/core/shared/types';
import type { Snippet, SnippetFilterOptions, Snippets, Tag, Tags, UpdateSnippetRequest, CreateSnippetRequest } from '~/features/fluppets/fluppets.types';
import { HttpClient } from '~/core/network/http_client';
import { Endpoint } from '~/core/network/endpoints';
import { AppStrings } from '~/core/strings';
import { stringify } from 'qs';
import { logDev } from '~/core/helpers/log';

export const useFluppetsStore = defineStore('fluppets', {
  state: () => ({
    fluppetsListResponse: new Wrapper<MultiApiResponse<Snippet>>().toInitial(),
    filteredFluppetsListResponse: new Wrapper<MultiApiResponse<Snippet>>().toInitial(),
    fluppetTags: new Wrapper<MultiApiResponse<Tag>>().toInitial(),
    fluppetUpdateResponse: new Wrapper<SingleApiResponse<Snippet>>().toInitial(),
    fluppetCreateResponse: new Wrapper<SingleApiResponse<Snippet>>().toInitial(),
  }),
  actions: {

    async update(payload: UpdateSnippetRequest) {
      this.fluppetUpdateResponse = new Wrapper<SingleApiResponse<Snippet>>().toLoading();
      try {
        //@ts-ignore
        const { $http } = useNuxtApp();
        const response: SingleApiResponse<Snippet> = await (<HttpClient>$http).put(
          Endpoint.updateSnippet(payload.data.documentId!),
          payload,
        );
        this.fluppetUpdateResponse =
          this.fluppetUpdateResponse.toSuccess(response);
      } catch (e) {
        logDev('Error updating snippet:', e);
        this.fluppetUpdateResponse = this.fluppetUpdateResponse.toFailed(AppStrings.unableToUpdateFluppets);
      }
    },

    async updateViews(payload: UpdateSnippetRequest) {
      this.fluppetUpdateResponse = new Wrapper<SingleApiResponse<Snippet>>().toLoading();
      try {
        //@ts-ignore
        const { $http } = useNuxtApp();
        const response: SingleApiResponse<Snippet> = await (<HttpClient>$http).put(
          Endpoint.updateSnippetViews(payload.data.documentId!),
          payload,
        );
        this.fluppetUpdateResponse =
          this.fluppetUpdateResponse.toSuccess(response);
      } catch (e) {
        logDev('Error updating snippet views:', e);
        this.fluppetUpdateResponse = this.fluppetUpdateResponse.toFailed(AppStrings.unableToUpdateFluppets);
      }
    },

    async create(payload: CreateSnippetRequest) {
      this.fluppetCreateResponse = new Wrapper<SingleApiResponse<Snippet>>().toLoading();
      try {
        //@ts-ignore
        const { $http } = useNuxtApp();
        const response: SingleApiResponse<Snippet> = await (<HttpClient>$http).post(
          Endpoint.createSnippet(),
          payload,
        );
        this.fluppetCreateResponse =
          this.fluppetCreateResponse.toSuccess(response);
      } catch (e) {
        logDev('Error creating snippet:', e);
        this.fluppetCreateResponse = this.fluppetCreateResponse.toFailed(AppStrings.unableToCreateFluppets);
      }
    },


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

      try {
        //@ts-ignore
        const { $http } = useNuxtApp();
        const response: MultiApiResponse<Tag> = await (<HttpClient>$http).get(
          `${Endpoint.tags}?populate=*&sort=createdAt:desc`,
        );
        this.fluppetTags = this.fluppetTags.toSuccess(response);
      } catch (e) {
        this.fluppetTags = this.fluppetTags.toFailed(AppStrings.unableToFetchTags);
      }
    },

    async filter(filters: SnippetFilterOptions): Promise<void> {

      this.filteredFluppetsListResponse = new Wrapper<MultiApiResponse<Snippet>>().toLoading(this.filteredFluppetsListResponse.value);
      try {

        let sort: string = 'views:desc';
        if (filters.sortKey === 'createdAt') {
          sort = 'createdAt:desc';
        }


        const query = stringify({
          populate: '*',
          filters: {
            ...(filters.tags && filters.tags.length > 0 && {
              tags: {
                ...(filters.tags.every(tag => typeof tag === 'number')
                  ? { id: { $in: filters.tags } }
                  : { slug: { $in: filters.tags } }
                ),
              },
            }),
            ...(filters.searchQuery && filters.searchQuery.length > 0 && {
              $or: [
                { description: { $containsi: filters.searchQuery } },
                { title: { $containsi: filters.searchQuery } },
              ],
            }),
          },
          ...(sort && { sort }),
        }, {
          encodeValuesOnly: true,
        });
        const { $http } = useNuxtApp();
        const response = await (<HttpClient>$http).get(`${Endpoint.snippets}?${query}`);
        // @ts-ignore
        this.filteredFluppetsListResponse = this.filteredFluppetsListResponse.toSuccess(response);
      } catch (e) {

        logDev('Error fetching filtered fluppets:', e);
        this.filteredFluppetsListResponse = this.filteredFluppetsListResponse.toFailed(AppStrings.unableToFetchFluppets);
      }
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
    isFluppetUpdateLoading: (state) => {
      return state.fluppetUpdateResponse.isLoading;
    },
    isFluppetUpdateError: (state) => {
      return state.fluppetUpdateResponse.isFailure;
    },
    isFluppetUpdateSuccess: (state) => {
      return state.fluppetUpdateResponse.isSuccess;
    },
    isFluppetCreateLoading: (state) => {
      return state.fluppetCreateResponse.isLoading;
    },
    isFluppetCreateError: (state) => {
      return state.fluppetCreateResponse.isFailure;
    },
    isFluppetCreateSuccess: (state) => {
      return state.fluppetCreateResponse.isSuccess;
    },
    fluppetCreateResponse: (state) => {
      return state.fluppetCreateResponse;
    },
  },
});
