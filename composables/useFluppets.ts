import { useClipboard, watchDebounced } from '@vueuse/core';
import { is } from 'date-fns/locale';
import { storeToRefs } from 'pinia';
import { useAnalytics } from '~/composables/useAnalytics';
import { MAX_FLUPPETS_PER_PAGE } from '~/core/constants';
import { logDev } from '~/core/helpers/log';
import { BaseToast } from '~/core/ui/base_toast';
import type { Snippet, SnippetFilterOptions, Tag, Tags } from '~/features/fluppets/fluppets.types';
import { AnalyticsEvent } from '~/services/analytics/events';

let fluppetsStateRef: ReturnType<typeof createFluppetsState> | null = null;

function createFluppetsState() {
  const { $toast } = useNuxtApp();
  const fluppetsStore = useFluppetsStore();

  const {
    isFluppetsListLoading,
    isFluppetsListError,
    isFluppetsListSuccess,
    isFluppetTagsLoading,
    isFluppetTagsError,
    isFluppetTagsSuccess,
    isFluppetUpdateLoading,
    isFluppetUpdateError,
    isFluppetUpdateSuccess,
    filteredFluppetsList,
    fluppetUpdateResponse,

    tags,
  } = storeToRefs(fluppetsStore);

  const filters = ref<SnippetFilterOptions>({
    tags: [],
    searchQuery: '',
    sortKey: 'views', // Default sort key
  });

  const currentPage = ref(1);

  const selectedTags = ref<Tags>([]);

  const searchQuery = ref(null);

  const popularTags = computed(() => {
    return tags.value.filter((tag) => tag.snippets.length > 0).slice(0, 8);
  });


  const paginatedFluppetsList = computed(() => {
    const startIndex = (currentPage.value - 1) * MAX_FLUPPETS_PER_PAGE;
    return (filteredFluppetsList.value ?? []).slice(startIndex, startIndex + MAX_FLUPPETS_PER_PAGE);
  });

  const totalPages = computed(() =>
    Math.ceil((filteredFluppetsList.value ?? []).length / MAX_FLUPPETS_PER_PAGE),
  );


  watchDebounced(
    () => filters.value,
    async () => {

      // selectedTags.value = filters.value.tags.filter((tag) => filters.value.tags);
      selectedTags.value = tags.value.filter((tag) =>
        filters.value.tags.includes(tag.slug),
      );

      useAnalytics().capture(AnalyticsEvent.fluppetsFiltersTriggered, { filters: filters.value });
      await fluppetsStore.filter(filters.value);
    },
    { debounce: 600, maxWait: 2000, rejectOnCancel: true, deep: true },
  );

  const fetchFluppets = async () => {
    await Promise.all([fluppetsStore.load(), fluppetsStore.loadTags()]);
  };


  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page;
    }
  };

  const nextPage = () => {
    if (currentPage.value < totalPages.value) {
      currentPage.value++;
    }
  };

  const previousPage = () => {
    if (currentPage.value > 1) {
      currentPage.value--;
    }
  };
  const fetchFluppetTags = async () => {
    await fluppetsStore.loadTags();
  };

  const discoverFluppets = () => {
    useAnalytics().capture(AnalyticsEvent.browseFluppetsPageButtonClicked);
    navigateTo(AppRoutes.exploreFluppets);
  };

  const handleTagClick = (tag: Tag) => {
    useAnalytics().capture(AnalyticsEvent.fluppetsTagClicked, { tag: tag.slug });

    if (selectedTags.value.includes(tag)) {
      selectedTags.value = selectedTags.value.filter((t) => t.documentId !== tag.documentId);
    } else {
      selectedTags.value.push(tag);
    }

    filters.value.tags = selectedTags.value.map((t) => t.slug);
  };

  const searchFluppets = () => { };

  const handleFluppetsCreate = () => {
    useAnalytics().capture(AnalyticsEvent.contributeFluppetsPageButtonClicked);
    if (useUser().isAuthenticated) {
      navigateTo(AppRoutes.createFluppets);
    } else {
      useAuthStore().setReturnUrl(AppRoutes.createFluppets);
      navigateTo(AppRoutes.login);
    }
  };

  const handleSnippetClick = (snippet: Snippet) => {
    useAnalytics().capture(AnalyticsEvent.fluppetsClicked, { snippet });
    navigateTo(AppRoutes.fluppetDetail(snippet.documentId));
  }

  const handleFluppetsCopy = async (snippet: Snippet) => {
    const { copy } = useClipboard({
      source: snippet.code.trim(),
      legacy: true,
    });

    await copy(snippet.code.trim());
    useAnalytics().capture(AnalyticsEvent.fluppetsClipboardButtonClicked, { snippet });

    ($toast as BaseToast<Notification>).info(AppStrings.fluppetsCopiedToClipboard);
  };

  const handleFluppetsShare = async (snippet: Snippet) => {
    useAnalytics().capture(AnalyticsEvent.fluppetsShareButtonClicked, { snippet });
    const url = new URL(AppRoutes.fluppetDetail(snippet.documentId), window.location.origin).toString();

    const { copy } = useClipboard({
      source: url,
      legacy: true,
    });

    await copy(url);

    useAnalytics().capture(AnalyticsEvent.fluppetsShareButtonClicked, { snippet });

    ($toast as BaseToast<Notification>).info(AppStrings.fluppetsLinkCopiedToClipboard);
  };

  const handleFluppetsFilterReset = () => {
    filters.value = {
      tags: [],
      searchQuery: '',
      sortKey: 'views', // Reset to default sort key
    };
    useAnalytics().capture(AnalyticsEvent.fluppetsFilterReset);
  };

  const toggleDescriptionPanel = (snippet: Snippet) => {
    useAnalytics().capture(AnalyticsEvent.fluppetsDescriptionPanelClicked, { snippet });
  };


  const handleFluppetsUpdateBase = async (
    updateFn: (args: { data: Snippet }) => Promise<void>,
    snippet: Snippet,
    errorMsgPrefix: string
  ) => {
    try {
      await updateFn({ data: snippet });

      if (isFluppetUpdateSuccess.value) {
        await fetchFluppets();
      }

      if (isFluppetUpdateError.value) {
        ($toast as BaseToast<Notification>).error(
          fluppetUpdateResponse.value.message as string
        );
      }
    } catch (error) {
      logDev(`${errorMsgPrefix}:`, error);
    }
  };

  const handleFluppetsUpdate = async (snippet: Snippet) => {
    await handleFluppetsUpdateBase(useFluppetsStore().update, snippet, 'Error updating fluppet');
  };

  const handleFluppetsUpdateViews = async (snippet: Snippet) => {
    await handleFluppetsUpdateBase(useFluppetsStore().updateViews, snippet, 'Error updating fluppet views');
  };

  return {
    paginatedFluppetsList,
    currentPage,
    totalPages,
    filters,
    searchQuery,
    selectedTags,
    tags,
    popularTags,
    fluppetsList: filteredFluppetsList,
    isTagsLoading: isFluppetTagsLoading,
    isTagsError: isFluppetTagsError,
    isTagsSuccess: isFluppetTagsSuccess,
    isFluppetsListLoading,
    isFluppetsListError,
    isFluppetsListSuccess,
    isFluppetUpdateLoading,
    isFluppetUpdateError,
    isFluppetUpdateSuccess,
    fetchFluppets,
    fetchFluppetTags,
    discoverFluppets,
    searchFluppets,
    handleSnippetClick,
    handleFluppetsCreate,
    handleFluppetsCopy,
    handleFluppetsShare,
    handleTagClick,
    handleFluppetsFilterReset,
    goToPage,
    nextPage,
    previousPage,
    toggleDescriptionPanel,
    handleFluppetsUpdate,
    handleFluppetsUpdateViews
  };
}

export function useFluppets() {
  // Create the state only once when this composable is first called
  if (!fluppetsStateRef) {
    fluppetsStateRef = createFluppetsState();
  }

  return fluppetsStateRef;
}
