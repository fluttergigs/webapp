import { FeatureFlagProvider } from '~/services/feature-flag/FeatureFlagProvider';

export default defineNuxtPlugin(({ vueApp }) => {
  const featureFlagsProvider: FeatureFlagProvider = new FeatureFlagProvider();

  featureFlagsProvider.load().then(() => {});

  return {
    provide: {
      featureFlags: featureFlagsProvider,
    },
  };
});
