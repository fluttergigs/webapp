import { useClipboard } from '@vueuse/core';
import { watchDebounced } from '@vueuse/core';
import type { is } from 'date-fns/locale';
import { storeToRefs } from 'pinia';
import { AppRoutes } from '~/.nuxt/imports';
import { useAnalytics } from '~/composables/useAnalytics';
import { BaseToast } from '~/core/ui/base_toast';
import type { Snippet, Tag, Tags } from '~/features/fluppets/fluppets.types';
import { AnalyticsEvent } from '~/services/analytics/events';

export function useFluppets() {
  const { $toast } = useNuxtApp();
  const fluppetsStore = useFluppetsStore();

  const {
    isFluppetsListLoading,
    isFluppetsListError,
    isFluppetsListSuccess,
    isFluppetTagsLoading,
    isFluppetTagsError,
    isFluppetTagsSuccess,
    filteredFluppetsList,
    tags,
  } = storeToRefs(fluppetsStore);

  const filters = ref({
    tags: [],
    searchQuery: '',
    sortKey: 'snippetCounts',
  });

  const selectedTags = ref<Tags>([]);

  const searchQuery = ref(null);

  const popularTags = computed(() => {
    return tags.value.filter((tag) => tag.snippets.length > 0).slice(0, 8);
  });

  const fetchFluppets = async () => {
    await Promise.all([fluppetsStore.load(), fluppetsStore.loadTags()]);
  };

  const fetchFluppetTags = async () => {
    await fluppetsStore.loadTags();
  };

  const browseFluppets = () => {
    useAnalytics().capture(AnalyticsEvent.browseFluppetsPageButtonClicked);
    navigateTo(AppRoutes.browseFluppets);
  };

  const handleTagClick = (tag: Tag) => {
    if (selectedTags.value.includes(tag)) {
      selectedTags.value = selectedTags.value.filter((t) => t.documentId !== tag.documentId);
    } else {
      selectedTags.value.push(tag);
    }
    useAnalytics().capture(AnalyticsEvent.fluppetsTagClicked, { tag });
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

  const handleFluppetsCopy = async (snippet: Snippet) => {
    const { copy } = useClipboard({
      source: snippet.code,
      legacy: true,
    });

    await copy(snippet.code);
    useAnalytics().capture(AnalyticsEvent.fluppetsClipboardButtonClicked, { snippet });

    ($toast as BaseToast<Notification>).info(AppStrings.fluppetsCopiedToClipboard);
  };

  const handleFluppetsShare = async (snippet: Snippet) => {
    useAnalytics().capture(AnalyticsEvent.fluppetsShareButtonClicked, { snippet });
    const url = `${AppRoutes.fluppetDetail(snippet.documentId)}`;

    const { copy } = useClipboard({
      source: url,
      legacy: true,
    });

    await copy(url);

    useAnalytics().capture(AnalyticsEvent.fluppetsShareButtonClicked, { snippet });

    ($toast as BaseToast<Notification>).info(AppStrings.fluppetsLinkCopiedToClipboard);
  };

  return {
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
    fetchFluppets,
    fetchFluppetTags,
    browseFluppets,
    searchFluppets,
    handleFluppetsCreate,
    handleFluppetsCopy,
    handleFluppetsShare,
    handleTagClick,
  };
}
