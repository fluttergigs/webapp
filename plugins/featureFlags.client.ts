import { FeatureFlagProvider } from '~/services/feature-flag/FeatureFlagProvider';

export default defineNuxtPlugin(async ({ vueApp }) => {
  const featureFlagsProvider: FeatureFlagProvider = new FeatureFlagProvider();

  await featureFlagsProvider.load();

  return {
    provide: {
      featureFlags: featureFlagsProvider,
    },
  };
});
