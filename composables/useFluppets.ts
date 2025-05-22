import { storeToRefs } from 'pinia';
import { AppRoutes } from '~/.nuxt/imports';
import { useAnalytics } from '~/composables/useAnalytics';
import { AnalyticsEvent } from '~/services/analytics/events';

export function useFluppets() {
  const fluppetsStore = useFluppetsStore();

  const { filteredFluppetsList } = storeToRefs(fluppetsStore);

  const fetchFluppets = async () => {
    await fluppetsStore.load();
  };

  const browseFluppets = () => {
    useAnalytics().capture(AnalyticsEvent.browseFluppetsPageButtonClicked);
  };

  const searchFluppets = () => {};

  const handleFluppetsCreate = () => {
    useAnalytics().capture(AnalyticsEvent.contributeFluppetsPageButtonClicked);
    if (useUser().isAuthenticated) {
      navigateTo(AppRoutes.createFluppets);
    } else {
      useAuthStore().setReturnUrl(AppRoutes.createFluppets);
      navigateTo(AppRoutes.login);
    }
  };

  return {
    fluppetsList: filteredFluppetsList.value,
    isFluppetsListLoading: fluppetsStore.isFluppetsListLoading,
    isFluppetsListError: fluppetsStore.isFluppetsListError,
    isFluppetsListSuccess: fluppetsStore.isFluppetsListSuccess,
    fetchFluppets,
    browseFluppets,
    searchFluppets,
    handleFluppetsCreate,
  };
}
