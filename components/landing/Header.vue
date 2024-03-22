<template>
  <section class="bg-blueGray-50">
    <div class="overflow-hidden">
      <div class="container px-4 py-6 md:py-8 mx-auto">
        <div class="flex flex-wrap -m-8 justify-center items-center">
          <div class="flex flex-col space-y-4 w-full md:w-1/2 p-8" contenteditable="false">
            <div
                class="inline-block mb-6 px-2 py-1 font-semibold bg-green-100 rounded-full" style="width: fit-content">
              <div class="flex flex-wrap items-center -m-1 p-2" contenteditable="false">
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
            <div class="flex flex-wrap -m-2.5 mb-20">
              <div class="w-full md:w-auto p-2.5">
                <div class="block">
                  <button
                      class="py-4 px-6 w-full text-white font-semibold border border-indigo-700 rounded-xl focus:ring focus:ring-indigo-300 bg-indigo-600 hover:bg-indigo-700 transition ease-in-out duration-200"
                      type="button"
                      @click="findJobs">
                    Find a job
                  </button>
                </div>
              </div>
              <div class="w-full md:w-auto p-2.5">
                <div class="block">
                  <button
                      class="py-4 px-9 w-full font-semibold border border-gray-300 hover:border-gray-400 rounded-xl focus:ring focus:ring-gray-50 bg-transparent hover:bg-gray-100 transition ease-in-out duration-200"
                      type="button"
                      @click="handleJobCreation"
                  >
                    <div class="flex flex-wrap justify-center items-center -m-1">
                      <div class="w-auto p-1">
                        <MegaphoneIcon class="text-gray-600 w-5"/>
                      </div>
                      <div class="w-auto p-1">
                        <span contenteditable="false">Post a new Flutter job</span>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div class="w-full md:w-1/2 p-8">
            <img
                alt=""
                class="transform hover:-translate-y-16 transition ease-in-out duration-1000"
                contenteditable="false"
                src="@/assets/images/header.png"
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
import {MegaphoneIcon} from "@heroicons/vue/24/solid";
import {AppAnalyticsProvider} from "~/services/analytics/app_analytics_provider";
import {AnalyticsEvent} from "~/services/analytics/events";
import ArrowBackIcon from "~/components/icons/ArrowBackIcon.vue";


const handleJobCreation = () => {
  (useNuxtApp().$analytics as AppAnalyticsProvider).capture(AnalyticsEvent.landingPageHeaderPostJobOfferButtonClicked,);
  useCompanyActions().handleJobCreation()
}

const findJobs = () => {
  (useNuxtApp().$analytics as AppAnalyticsProvider).capture(AnalyticsEvent.landingPageHeaderFindJobsButtonClicked,);
  navigateTo(AppRoutes.jobs)
}
</script>
<style scoped>

</style>