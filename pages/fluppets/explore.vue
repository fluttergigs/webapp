import { AnalyticsEvent } from "~/services/analytics/events";

<script lang="ts" setup>
  import PopularTags from '~/components/fluppets/PopularTags.vue';
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

  const { popularTags, fluppetsList } = useFluppets();
</script>

<template>
  <main class="pattern-bg to-slate-50">
    <div class="flex flex-col gap-4 px-4 sm:px-8 md:px-20 py-10">
      <div class="my-4"></div>
      <div class="flex justify-between">
        <PopularTags :tags="popularTags" />

        <UButton
          class="h-fit"
          icon="i-heroicons-plus-circle-solid"
          label="Contribute"
          size="xl"
          variant="solid"
          @click=""
        />
      </div>

      <div class="flex gap-2">
        <div class="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2">
          <SnippetCard v-for="fluppet in fluppetsList" :key="fluppet.id" :snippet="fluppet" />
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped></style>
