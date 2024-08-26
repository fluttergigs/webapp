import {useFeatureFlags} from "~/composables/useFeatureFlags";

export default defineNuxtPlugin(async (nuxtApp) => {
    nuxtApp.hook('app:beforeMount', async () => {
        // useAppStore().toggleMainLoader()
        await useFeatureFlags().loadFlags()
    })
})