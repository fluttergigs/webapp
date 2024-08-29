<script setup lang="ts">

import {AppRoutes} from "~/core/routes";
import {useJobStore} from "~/stores/job";
import {storeToRefs} from "pinia";
import {AppAnalyticsProvider} from "~/services/analytics/app_analytics_provider";
import {AnalyticsEvent} from "~/services/analytics/events";

const {landingPageJobs} = storeToRefs(useJobStore())

const findJobs = () => {
  (useNuxtApp().$analytics as AppAnalyticsProvider).capture(AnalyticsEvent.landingPageUserSectionFindJobsButtonClicked,);
  navigateTo(AppRoutes.jobs)
}
</script>

<template>
  <section class="relative py-16 bg-blueGray-100 overflow-hidden w-full">
    <img
        class="absolute left-1/2 bottom-0 transform translate-x-1/4"
        src="@/assets/images/gradient6.svg"
        alt=""
    />
    <div class="relative container sm:px-10 px-4 py-8 mx-auto">
      <p class="mb-6 text-sm text-indigo-600 font-bold uppercase tracking-px">
        For job seekers
      </p>

      <div class="md:flex md:justify-between">
        <div class="md:max-w-2xl">
          <h2
              class="mb-5 text-5xl md:text-6xl font-bold font-heading tracking-px-n leading-tight">
            Find your dream Flutter job today
          </h2>
          <p class="mb-20 text-gray-600 font-medium leading-relaxed md:max-w-md">
            Looking for a Flutter gig? Look no further! FlutterGigs has everything you need to
            find your dream gig today.
          </p>
        </div>
        <UButton @click="findJobs" class="bg-indigo-700"
                 color="indigo" style="height: fit-content" size="xl" label="Find jobs"/>
      </div>

      <div class="flex flex-wrap my-4" v-if="landingPageJobs">
        <JobCardDetailed :job="job" v-for="job in landingPageJobs" :key="job.slug"/>
      </div>
    </div>
  </section>
</template>

<style scoped>

</style>