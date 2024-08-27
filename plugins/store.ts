export default defineNuxtPlugin(async (nuxtApp) => {
    nuxtApp.hook('app:created', async () => {
        // useAppStore().toggleMainLoader()
        await useFeatureFlags().loadFlags()
    })
})