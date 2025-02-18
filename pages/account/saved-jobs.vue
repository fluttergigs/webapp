<template>
  <main class="w-full">
    <div class="flex flex-col w-full">
      <section class="py-8 px-2 md:py-12 xl:pb-56 bg-white overflow-hidden">
        <div class="flex justify-between items-center">
          <h3
              class="mb-4 text-xl md:text-3xl font-semibold tracking-px-n leading-tight">
            Your saved jobs
          </h3>
        </div>

        <keep-alive>
          <UTabs :items="tabs" class="w-full my-12">
            <template #item="{ item }">

              <div v-if="item.key === 'all'" class="space-y-3">
                <JobOffersList v-if="!!bookmarkedJobsListResponse" :jobs="bookmarkedJobs"
                               :jobs-response="bookmarkedJobsListResponse"
                               class="my-10">

                  <template #cta>
                    <UButton :to="AppRoutes.jobs" label="Browse available jobs"/>
                  </template>
                </JobOffersList>
              </div>
              <div v-else-if="item.key === 'active'" class="space-y-3">
                <JobOffersList v-if="!!bookmarkedJobsListResponse" :jobs="activeBookmarkedJobs"
                               :jobs-response="bookmarkedJobsListResponse"
                               class="my-10">
                  <template #cta>
                    <UButton :to="AppRoutes.jobs" label="Browse available jobs"/>
                  </template>
                </JobOffersList>
              </div>
              <div v-else-if="item.key === 'expired'" class="space-y-3">
                <JobOffersList v-if="!!bookmarkedJobsListResponse" :jobs="expiredBookmarkedJobs"
                               :jobs-response="bookmarkedJobsListResponse"
                               class="my-10">
                  <template #cta>
                    <UButton :to="AppRoutes.jobs" label="Browse available jobs"/>
                  </template>
                </JobOffersList>
              </div>

            </template>
          </UTabs>
        </keep-alive>
      </section>
    </div>
  </main>
</template>

<script setup>
import {useAuthStore} from "~/stores/auth";
import {storeToRefs} from "pinia";
import {AnalyticsEvent} from "~/services/analytics/events";
import {useUserStore} from "~/stores/user";
import {AppRoutes} from "~/core/routes";

definePageMeta({layout: 'app-layout', middleware: ['auth']})

useHead({title: "FlutterGigs - My saved jobs"});

const authStore = useAuthStore()
const userStore = useUserStore()
const {$analytics} = useNuxtApp()

const tabs = [{
  key: 'all',
  label: 'All',
  description: 'All your saved jobs'
}, {
  key: 'active',
  label: 'Active',
  description: 'Active saved jobs'
}, {
  key: 'expired',
  label: 'Expired',
  description: 'Expired saved jobs'
}]

onMounted(() => {
  $analytics.capture(AnalyticsEvent.mySavedJobsPageEntered);
})

onBeforeMount(() => {
  userStore.fetchBookmarkedJobOffers()
})

const {activeBookmarkedJobs, expiredBookmarkedJobs, bookmarkedJobs, bookmarkedJobsListResponse} = storeToRefs(userStore)
</script>

<style scoped>

</style>