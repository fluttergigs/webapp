import {storeToRefs} from "pinia";
import type {LearnCategory, LearnResource} from "~/features/learn/learn.types";
import type {AppAnalyticsProvider} from "~/services/analytics/app_analytics_provider";
import {AnalyticsEvent} from "~/services/analytics/events";

export function useLearn() {
    const learnStore = useLearnStore()
    const {
        getLearnCategories,
        getLearnResources,
        getSelectedCategory,
        fetchLearnCategoriesProcess,
        fetchLearnResourcesProcess,
    } = storeToRefs(learnStore)
    const {$toast, $analytics} = useNuxtApp();

    const handleLearnCategoryClick = (category: LearnCategory) => {
        ($analytics as AppAnalyticsProvider).capture(AnalyticsEvent.learnCategoryClicked, {learnCategory: category});
        learnStore.setSelectedCategory(category)
    }

    const handleLearnResourceClick = (resource: LearnResource) => {
        ($analytics as AppAnalyticsProvider).capture(AnalyticsEvent.learnResourceClicked, {learnResource: resource});
        window.open(resource.link, '_blank')
    }

    const isFetchingLearnCategories = computed(() => fetchLearnCategoriesProcess.value?.isLoading)
    const isFetchingLearnResources = computed(() => fetchLearnResourcesProcess.value?.isLoading)

    const isLearnCategoriesFetched = computed(() => fetchLearnCategoriesProcess.value?.isSuccess)
    const isLearnResourcesFetched = computed(() => fetchLearnResourcesProcess.value?.isSuccess)

    const getSelectedCategoryResources = computed(() => {
        if (getSelectedCategory.value) {
            return getLearnResources.value?.filter(resource => resource.category.data['attributes']['slug'] === getSelectedCategory.value.slug)
        }
        return []
    })

    return {
        handleLearnCategoryClick,
        handleLearnResourceClick,
        getSelectedCategoryResources,
        getLearnCategories,
        getSelectedCategory,
        isFetchingLearnCategories,
        isFetchingLearnResources,
        isLearnCategoriesFetched,
        isLearnResourcesFetched
    }
}