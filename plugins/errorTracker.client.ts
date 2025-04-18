import { ErrorTrackerProvider } from '~/services/error-tracker/ErrorTrackerProvider';

export default defineNuxtPlugin(({ vueApp }) => {
  const errorTracker = new ErrorTrackerProvider();

  return {
    provide: {
      errorTracker,
    },
  };
});
