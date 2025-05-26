import { AnalyticsEvent } from "~/services/analytics/events";

<script lang="ts" setup>
//@ts-ignore
import FiltersWidget from '~/components/fluppets/FiltersWidget.vue';
//@ts-ignore

import PopularTags from '~/components/fluppets/PopularTags.vue';
//@ts-ignore
import SnippetCard from '~/components/fluppets/SnippetCard.vue';
import { AnalyticsEvent } from '~/services/analytics/events';

definePageMeta({
  title: 'Fluppets - Discover & Share & Integrate Flutter Snippets',
  layout: 'main-layout',
});

useSeoMeta({
  title: 'FlutterGigs - Discover & Share Flutter Snippets',
  description: 'FlutterGigs - Discover the best resources to hone your skills',
  ogTitle: 'FlutterGigs  - Discover & Share Flutter Snippets',
  ogDescription: 'Discover the best resources to hone your skills',
  ogImageUrl: 'https://fluttergigs.com/fluttergigs-og.png',
  twitterImage: 'https://fluttergigs.com/fluttergigs-og.png',
  twitterCard: 'summary_large_image',
  ogSiteName: 'Flutter Gigs - The #1 Flutter job platform',
  twitterSite: '@fluttergigs',
  twitterTitle: 'FlutterGigs - Discover & Share Flutter Snippets',
  twitterDescription: 'FlutterGigs - Discover & Share Flutter Snippets',
});

onMounted(() => {
  useAnalytics().capture(AnalyticsEvent.browseFluppetsPageEntered);
});

const { popularTags, fluppetsList, isFluppetsListLoading, handleFluppetsCreate } = useFluppets();
</script>

<template>
  <main class="pattern-bg to-slate-50 relative">
    <USlideover title="Filters">
      <UButton class="lg:hidden fixed bottom-12 left-12 z-50 rounded-full w-12 h-12"
        icon="i-heroicons-adjustments-vertical" size="xl" />
      <template #body>
        <FiltersWidget />
      </template>
    </USlideover>

    <div class="flex flex-col gap-4 px-4 sm:px-8 md:px-12 py-10">
      <div class="my-4"></div>
      <div class="flex justify-between">
        <PopularTags :tags="popularTags" />

        <UButton class="h-fit" icon="i-heroicons-plus-circle-solid" label="Contribute" size="xl" variant="solid"
          @click="handleFluppetsCreate" />
      </div>

      <div class="flex gap-2">
        <div class="w-full lg:w-6/8">
          <div class="flex justify-center items-center h-full w-full" v-if="isFluppetsListLoading">
            <UIcon name="i-lucide-loader-circle" class="w-12 h-12 animate-spin text-indigo-600" />
          </div>

          <div v-else class="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2">
            <SnippetCard v-for="fluppet in fluppetsList" :key="fluppet.id" :snippet="fluppet" />
          </div>
        </div>

        <FiltersWidget class="hidden lg:block lg:w-2/8" />
      </div>
    </div>
  </main>
</template>

<style scoped></style>
