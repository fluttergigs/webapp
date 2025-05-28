<script lang="ts" setup>
//@ts-ignore
import FiltersWidget from "~/components/fluppets/FiltersWidget.vue";
//@ts-ignore
import SnippetList from "~/components/fluppets/SnippetList.vue";
//@ts-ignore

import PopularTags from "~/components/fluppets/PopularTags.vue";
//@ts-ignore
import { AnalyticsEvent } from "~/services/analytics/events";
import { useFluppets } from "~/composables/useFluppets";
import { useAnalytics } from "~/composables/useAnalytics";

definePageMeta({
  title: "Fluppets - Discover & Share & Integrate Flutter Snippets",
  layout: "main-layout",
});

defineOgImageScreenshot({
  //@ts-ignore
  delay: 1200,
  selector: "#explore-fluppets",
  mask: "#navbar",
});

useSeoMeta({
  title: "FlutterGigs - Discover & Share Flutter Snippets",
  description: "FlutterGigs - Discover the best resources to hone your skills",
  ogTitle: "FlutterGigs  - Discover & Share Flutter Snippets",
  ogDescription: "Discover the best resources to hone your skills",
  ogImageUrl: "https://fluttergigs.com/fluppets-og.png",
  twitterImage: "https://fluttergigs.com/fluppets-og.png",
  twitterCard: "summary_large_image",
  ogSiteName: "Flutter Gigs - The #1 Flutter job platform",
  twitterSite: "@fluttergigs",
  twitterTitle: "FlutterGigs - Discover & Share Flutter Snippets",
  twitterDescription: "FlutterGigs - Discover & Share Flutter Snippets",
});

onMounted(() => {
  useAnalytics().capture(AnalyticsEvent.browseFluppetsPageEntered);
});

const {
  currentPage,
  popularTags,
  fluppetsList,
  paginatedFluppetsList,
  isFluppetsListLoading,
  handleFluppetsCreate,
  handleFluppetsFilterReset,
} = useFluppets();

const breadcrumbs = computed(() => [
  {
    label: "Home",
    icon: "i-lucide-home",
    to: AppRoutes.fluppets,
  },
  {
    label: "Fluppets",
    icon: "i-lucide-search",
    to: AppRoutes.exploreFluppets,
  },
]);
</script>

<template>
  <main class="pattern-bg to-slate-50 relative">
    <USlideover title="Filters">
      <UButton class="lg:hidden fixed bottom-12 left-12 z-50 rounded-full w-12 h-12" icon="i-lucide-list-filter"
        size="xl" />
      <template #body>
        <FiltersWidget />
      </template>
    </USlideover>

    <div class="flex flex-col gap-4 px-4 sm:px-8 md:px-12 py-10" id="explore-fluppets">
      <div class="my-4"></div>

      <UBreadcrumb :items="breadcrumbs"></UBreadcrumb>

      <div class="flex justify-between">
        <PopularTags :tags="popularTags" />

        <UButton class="h-fit" icon="i-lucide-git-branch-plus" label="Contribute" size="xl" variant="solid"
          @click="handleFluppetsCreate" />
      </div>

      <div class="flex gap-2">
        <div class="w-full lg:w-6/8">
          <div class="flex flex-col gap-4">
            <SnippetList @reset-filters="handleFluppetsFilterReset" :list="paginatedFluppetsList"
              :isLoading="isFluppetsListLoading" />

            <UPagination v-if="fluppetsList.length > 0" v-model:page="currentPage"
              :items-per-page="MAX_FLUPPETS_PER_PAGE" :total="fluppetsList.length" class="self-center" />
          </div>
        </div>

        <FiltersWidget class="hidden lg:block lg:w-2/8" />
      </div>
    </div>
  </main>
</template>

<style scoped></style>
