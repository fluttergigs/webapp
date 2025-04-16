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
        fetchLearnCategoriesProcess: new Wrapper<MultiApiResponse<LearnCategory>>().toInitial(),
        fetchLearnResourcesProcess: new Wrapper<MultiApiResponse<LearnResource>>().toInitial(),
        selectedCategory: Wrapper.getEmpty().toInitial(),
    }),
    actions: {
        async fetchLearnCategories(): Promise<void> {
            this.fetchLearnCategoriesProcess = new Wrapper<MultiApiResponse<LearnCategory>>().toLoading()
            try {
                //@ts-ignore
                const {$http} = useNuxtApp()
                const response = await (<HttpClient>$http).get(`${Endpoint.learnCategories}?populate=*`)
                this.fetchLearnCategoriesProcess = this.fetchLearnCategoriesProcess.toSuccess(response)

                this.setSelectedCategory(this.getLearnCategories[0])
            } catch (e) {
                this.fetchLearnCategoriesProcess = this.fetchLearnCategoriesProcess.toFailed(AppStrings.unableToFetchLearnCategories)
            }
        },
        async fetchLearnResources(): Promise<void> {
            this.fetchLearnResourcesProcess = new Wrapper<MultiApiResponse<LearnResource>>().toLoading()
            try {
                //@ts-ignore
                const {$http} = useNuxtApp()
                const response = await (<HttpClient>$http).get(`${Endpoint.learnResources}?populate=*`)
                this.fetchLearnResourcesProcess = this.fetchLearnResourcesProcess.toSuccess(response)
            } catch (e) {
                this.fetchLearnResourcesProcess = this.fetchLearnResourcesProcess.toFailed(AppStrings.unableToFetchLearnResources)
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
        getLearnCategories: (state) => (state.fetchLearnCategoriesProcess.value?.data ?? []) as LearnCategory[],
        getLearnResources: (state) => (state.fetchLearnResourcesProcess.value?.data ?? []) as LearnResource[],
        getSelectedCategory: (state) => state.selectedCategory.value as LearnCategory,
    },
})