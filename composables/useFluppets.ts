import { useAnalytics } from "~/composables/useAnalytics";
import { AnalyticsEvent } from "~/services/analytics/events";
import { storeToRefs } from "pinia";

export function useFluppets() {
  const fluppetsStore = useFluppetsStore();

  const { filteredFluppetsList } = storeToRefs(fluppetsStore);

  const fetchFluppets = () => {
    fluppetsStore.load();
  };

  const browseFluppets = () => {
    useAnalytics().capture(AnalyticsEvent.browseFlutterPageButtonClicked);
  };

  const searchFluppets = () => {};

  const handleFluppetsCreate = () => {};

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
