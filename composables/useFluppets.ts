import { useClipboard } from '@vueuse/core';
import { storeToRefs } from 'pinia';
import { AppRoutes } from '~/.nuxt/imports';
import { useAnalytics } from '~/composables/useAnalytics';
import { BaseToast } from '~/core/ui/base_toast';
import type { Snippet, Tags } from '~/features/fluppets/fluppets.types';
import { AnalyticsEvent } from '~/services/analytics/events';

export function useFluppets() {
  const { $toast } = useNuxtApp();
  const fluppetsStore = useFluppetsStore();

  const selectedTags = ref<Tags>([]);

  const { filteredFluppetsList, tags } = storeToRefs(fluppetsStore);

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
    selectedTags,
    tags,
    popularTags,
    fluppetsList: filteredFluppetsList.value,
    isFluppetsListLoading: fluppetsStore.isFluppetsListLoading,
    isFluppetsListError: fluppetsStore.isFluppetsListError,
    isFluppetsListSuccess: fluppetsStore.isFluppetsListSuccess,
    isTagsLoading: fluppetsStore.isFluppetTagsLoading,
    isTagsError: fluppetsStore.isFluppetTagsError,
    isTagsSuccess: fluppetsStore.isFluppetTagsSuccess,
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
