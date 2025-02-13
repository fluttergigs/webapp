<template>

  <main>
    <section class="py-20 bg-blueGray-50">
      <div class="flex flex-col gap-4 overflow-hidden">
        <div class="container px-4 mx-auto flex justify-center items-center">
          <div class="flex flex-col justify-center max-w-2xl">
            <h3 class="text-2xl md:text-7xl font-semibold primary-gradient">
              Best resources for your skills
            </h3>

            <p class="text-sm md:text-md">Discover the best resources to hone your skills</p>
          </div>
        </div>
      </div>
    </section>

    <section class="py-20 px-10 bg-white">
      <div class="flex flex-col gap-4 overflow-hidden">
        <client-only>
          <LearnCategories/>
          <LearnResources/>
        </client-only>
      </div>
    </section>

  </main>
</template>

<script lang="ts" setup>

import '@/components/landing/Header.vue'
import type {AppAnalyticsProvider} from "~/services/analytics/app_analytics_provider";
import {AnalyticsEvent} from "~/services/analytics/events";
import LearnResources from "~/components/learn/resources.vue";

definePageMeta({
  layout: 'main-layout',
  title: 'Find the best resources to advance your Flutter skills',
})

useSeoMeta({
  title: 'FlutterGigs - Find the best resources to advance your Flutter skills',
  description: 'Discover the best resources to hone your skills',
  ogTitle: 'Find the best resources to advance your Flutter skills',
  ogDescription: 'Discover the best resources to hone your skills',
  ogImageUrl: 'https://fluttergigs.com/fluttergigs-og.png',
  twitterImage: 'https://fluttergigs.com/fluttergigs-og.png',
  twitterCard: 'summary_large_image',
  ogSiteName: 'Flutter Gigs - The #1 Flutter job platform',
  twitterSite: '@fluttergigs',
  twitterTitle: 'Find the best resources to advance your Flutter skills',
  twitterDescription: 'Discover the best resources to hone your skills',
})

const {$analytics} = useNuxtApp()

onMounted(() => {
  ($analytics as AppAnalyticsProvider).capture(AnalyticsEvent.learnCategoryPageEntered,);
})
</script>
