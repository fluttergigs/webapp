<template>
  <section class="bg-blueGray-100">
    <div class="container px-4 py-16 mx-auto">
      <div class="flex flex-col -m-8">
        <h1 class="mb-6 text-5xl md:text-6xl lg:text-6xl font-semibold primary-gradient">
          FlutterGigs
        </h1>

        <p class="mb-11 text-lg text-gray-900 font-medium">
          Discover the best Flutter opportunities at top
          remote companies around the world.
        </p>
      </div>
    </div>
  </section>

  <section class="flex bg-gradient-white px-20 py-14 w-full mx-auto">

    <div class="w-full md:w-1/6">
      <FiltersWidget/>

    </div>
    <div class="w-full md:w-4/6">
      <JobOffersList :jobs="filteredJobs"
                     :jobs-response="jobFiltersResponse" class="md:mx-8"/>
    </div>

  </section>

</template>

<script setup>

import FiltersWidget from "~/components/job/FiltersWidget.vue";
import JobOffersList from "~/components/job/JobOffersList.vue";
import {AnalyticsEvent} from "~/services/analytics/events";
import {storeToRefs} from "pinia";
import {useJobStore} from "~/stores/job";

definePageMeta({
  layout: 'main-layout',
})

const {$analytics} = useNuxtApp()
const {filteredJobs, jobFiltersResponse} = storeToRefs(useJobStore())

onMounted(() => {
  $analytics.capture(AnalyticsEvent.findJobOfferPageEntered)
})

</script>

<style scoped>

</style>