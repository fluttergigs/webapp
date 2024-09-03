import {defineStore} from "pinia";
import {Wrapper} from "~/core/wrapper";
import {Endpoint} from "~/core/network/endpoints";
import {HttpClient} from "~/core/network/http_client";
import {LearnCategory, LearnResource} from "~/features/learn/learn.types";
import {AppStrings} from "~/core/strings";
import type {MultiApiResponse} from "~/core/shared/types";

// @ts-ignore
export const useLearnStore = defineStore('learn', {
    state: () => ({
        fetchLearnCategories: new Wrapper<MultiApiResponse<LearnCategory>>().toInitial(),
        fetchLearnResources: new Wrapper<MultiApiResponse<LearnResource>>().toInitial(),
        selectedCategory: Wrapper.getEmpty().toInitial(),
    }),
    actions: {
        async fetchLearnCategories(): Promise<void> {
            this.fetchLearnCategories = new Wrapper<MultiApiResponse<LearnCategory>>().toLoading()
            try {
                //@ts-ignore
                const {$http} = useNuxtApp()
                const response = await (<HttpClient>$http).get(`${Endpoint.learnCategories}?populate=*`)
                this.fetchLearnCategories = this.fetchLearnCategories.toSuccess(response)

                this.setSelectedCategory(this.getLearnCategories[0])
            } catch (e) {
                this.fetchLearnCategories = this.fetchLearnCategories.toFailed(AppStrings.unableToFetchLearnCategories)
            }
        },
        async fetchLearnResources(): Promise<void> {
            this.fetchLearnResources = new Wrapper<MultiApiResponse<LearnResource>>().toLoading()
            try {
                //@ts-ignore
                const {$http} = useNuxtApp()
                const response = await (<HttpClient>$http).get(`${Endpoint.learnResources}?populate=*`)
                this.fetchLearnResources = this.fetchLearnResources.toSuccess(response)
            } catch (e) {
                this.fetchLearnResources = this.fetchLearnResources.toFailed(AppStrings.unableToFetchLearnResources)
            }
        },
        setSelectedCategory(category: LearnCategory) {
            this.selectedCategory = new Wrapper().toLoading(category)
            try {
                this.selectedCategory = this.selectedCategory.toSuccess(category)
            } catch (e) {
            }
        },
    },
    getters: {
        getLearnCategories: (state) => state.fetchLearnCategories.value?.data?.map((item: { [x: string]: any; }) => ({
            ...item['attributes'],
            id: item['id']
        })),
        getLearnResources: (state) => state.fetchLearnResources.value?.data?.map((item: { [x: string]: any; }) => ({
            ...item['attributes'],
            id: item['id']
        })),
        getSelectedCategory: (state) => state.selectedCategory.value,
    },
})