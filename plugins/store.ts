export default defineNuxtPlugin(async (nuxtApp) => {
  nuxtApp.hook('app:mounted', async () => {
    // useAppStore().toggleMainLoader()
    /*
    if (import.meta.client) {
      await useFeatureFlags().loadFlags();
    }*/
  });
});
