<template>

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
      <LearnCategories/>

      <LearnResources/>
    </div>
  </section>

</template>

<script setup lang="ts">

import '@/components/landing/Header.vue'
import type {AppAnalyticsProvider} from "~/services/analytics/app_analytics_provider";
import {AnalyticsEvent} from "~/services/analytics/events";
import LearnResources from "~/components/learn/resources.vue";

definePageMeta({
  layout: 'main-layout',
})

const {$analytics} = useNuxtApp()


onMounted(() => {
  ($analytics as AppAnalyticsProvider).capture(AnalyticsEvent.learnCategoryPageEntered,);
})


useServerSeoMeta({
  title: 'Flutter Gigs - The #1 Flutter job platform',
  ogTitle: 'Flutter Gigs - The #1 Flutter job platform',
  ogUrl: 'https://fluttergigs.com',
  ogImage: 'https://fluttergigs.com/fluttergigs-og.png',
  description: 'Flutter Gigs is a platform to find Flutter framework related job opportunities and more',
  ogDescription: 'Flutter Gigs is a platform to find Flutter framework related job opportunities and more',
  ogSiteName: 'Flutter Gigs - The #1 Flutter job platform',
  twitterCard: 'summary_large_image',
  twitterSite: '@fluttergigs',
  twitterTitle: () => `Flutter Gigs - Find the best Flutter opportunities at top remote companies around the world`,
  twitterDescription: () => 'Flutter Gigs is a platform to find Flutter framework related job opportunities and more',
  twitterImage: () => 'https://fluttergigs.com/fluttergigs-og.png',
})

</script>
