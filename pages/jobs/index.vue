<template>
  <section class="relative bg-blueGray-50 overflow-hidden">
    <img
        class="absolute left-1/2 bottom-0 transform z-[-10]"
        src="@/assets/images/gradient6.svg"
        alt=""
    />
    <div class="container px-4 py-16 mx-auto">
      <div class="flex flex-col p-8">
        <h1 class="mb-6 text-5xl md:text-6xl lg:text-6xl font-semibold primary-gradient">
          FlutterGigs
        </h1>

        <p class="mb-11 text-lg text-gray-900 font-medium">
          Discover the best Flutter opportunities and more at top
          remote companies around the world.
        </p>
      </div>
    </div>
  </section>

  <section class="flex flex-wrap bg-gradient-white px-20 py-14 w-full mx-auto">

    <div class="w-full md:w-1/6">
      <FiltersWidget/>

    </div>
    <div class="w-full sm:w-5/6 md:w-4/6 my-4 md:my-0">
      <JobOffersList v-if="!!jobFiltersResponse" :jobs="filteredJobs"
                     :jobs-response="jobFiltersResponse" class="md:mx-8">
        <template #default="{job}">

          <JobCard :job="job" v-if="isMediumScreen"/>

          <JobCardDetailed :job="job" v-else/>

        </template>
      </JobOffersList>
    </div>

  </section>

</template>

<script setup>

import FiltersWidget from "~/components/job/FiltersWidget.vue";
import JobOffersList from "~/components/job/JobOffersList.vue";
import {AnalyticsEvent} from "~/services/analytics/events";
import {storeToRefs} from "pinia";
import {useJobStore} from "~/stores/job";
import {useMediaQuery} from "@vueuse/core";

definePageMeta({
  layout: 'main-layout',
  keepalive: true,
})

useHead({title: `Flutter Gigs - Browse jobs`});

useSeoMeta({
  title: 'Flutter Gigs - The #1 Flutter job platform',
  ogUrl: 'https://fluttergigs.com',
  ogTitle: 'Flutter Gigs - The #1 Flutter job platform',
  ogImage: 'https://fluttergigs.com/fluttergigs-og.png',
  description: 'Flutter Gigs is a platform to find Flutter framework related job opportunities and more',
  ogDescription: 'Flutter Gigs is a platform to find Flutter framework related job opportunities and more',
  ogSiteName: 'Flutter Gigs - The #1 Flutter job platform',
  twitterCard: 'summary_large_image',
  twitterSite: '@fluttergigs',
  twitterTitle: () => `Flutter Gigs - Find the best Flutter opportunities at top remote companies around the world`,
  twitterDescription: () => 'Flutter Gigs is a platform to find Flutter framework related job opportunities and more',
  twitterImage: 'https://fluttergigs.com/fluttergigs-og.png',
})

const {$analytics} = useNuxtApp()
const {filteredJobs, jobFiltersResponse} = storeToRefs(useJobStore())

const isMediumScreen = useMediaQuery('(min-width: 768px)')

onMounted(() => {
  $analytics.capture(AnalyticsEvent.findJobOfferPageEntered)
})

</script>

<style scoped>

</style>