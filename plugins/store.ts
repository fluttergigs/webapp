export default defineNuxtPlugin(async (nuxtApp) => {
  nuxtApp.hook('app:created', async () => {
    // useAppStore().toggleMainLoader()

    if (import.meta.client) {
      await useFeatureFlags().loadFlags();
    }
  });
});