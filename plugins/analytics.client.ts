import { AppAnalyticsProvider } from '~/services/analytics/AppAnalyticsProvider';

export default defineNuxtPlugin(({ vueApp }) => {
  const appAnalyticsProvider = new AppAnalyticsProvider();

  return {
    provide: {
      analytics: appAnalyticsProvider,
    },
  };
});
