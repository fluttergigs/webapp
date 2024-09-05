<template>
  <section class="bg-blueGray-50">
    <div class="overflow-hidden">
      <div class="container py-6 md:py-8 mx-auto">
        <div class="flex flex-wrap justify-center items-center">
          <div class="flex flex-col gap-8 w-full md:w-1/2 p-6 md:p-8" contenteditable="false">
            <div
                class="inline-block mb-6 px-2 py-1 font-semibold bg-green-100 rounded-full" style="width: fit-content">
              <div class="flex items-center -m-1 p-2" contenteditable="false">
                <div contenteditable="false">
                  <NuxtLink :to="AppRoutes.jobs" class="text-sm" contenteditable="false">Find the best Flutter gigs from
                    all around the
                    world!
                  </NuxtLink>
                </div>
                <div class="w-auto p-1">
                  <ArrowBackIcon class="rotate-180"/>
                </div>
              </div>
            </div>

            <div class="flex flex-col gap-4 px-2 sm:px-0">
              <h1
                  class="mb-6 text-5xl md:text-7xl lg:text-8xl font-bold
                leading-none primary-gradient"
                  contenteditable="false">
                The #1 Flutter job board in the ecosystem<br/>
              </h1>

              <p class="mb-11 text-lg text-gray-900 font-medium md:max-w-md">
                Get the best-in-class group mentoring plans and professional benefits for
                your team
              </p>
              <div style="width: fit-content" class="flex flex-col sm:flex-row gap-3 my-20 items-start md:items-center">

                <UButton
                    @click="findJobs"
                    icon="i-heroicons-magnifying-glass-solid"
                    color="indigo"
                    class="py-5 px-9 rounded-xl flex gap-2 font-medium"
                    label="Find your next job now"/>
                <UButton
                    @click="handleJobCreation"
                    icon="i-heroicons-megaphone-solid"
                    color="white"
                    class="py-5 px-9 rounded-xl flex gap-2 font-medium"
                    label="Post a new Flutter job"/>
              </div>
            </div>

          </div>
          <div class="w-full md:w-1/2 p-8">
            <NuxtImg
                placeholder
                alt=""
                class="transform hover:-translate-y-16 transition ease-in-out duration-1000"
                contenteditable="false"
                src="/header.png"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>

import {AppRoutes} from "~/core/routes";
import useCompanyActions from '@/composables/useCompanyActions'
import {AppAnalyticsProvider} from "~/services/analytics/app_analytics_provider";
import {AnalyticsEvent} from "~/services/analytics/events";
import ArrowBackIcon from "~/components/icons/ArrowBackIcon.vue";

const {$analytics} = useNuxtApp()

const handleJobCreation = () => {
  ($analytics as AppAnalyticsProvider).capture(AnalyticsEvent.landingPageHeaderPostJobOfferButtonClicked,);
  useCompanyActions().handleJobCreation()
}

const findJobs = () => {
  ($analytics as AppAnalyticsProvider).capture(AnalyticsEvent.landingPageHeaderFindJobsButtonClicked,);
  navigateTo(AppRoutes.jobs)
}
</script>
<style scoped>

</style>