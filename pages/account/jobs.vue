<template>
  <div class="flex flex-col w-full">
    <section class="py-8 px-2 md:py-12 xl:pb-56 bg-white overflow-hidden">

      <div class="flex justify-between items-center">
        <h3
            class="mb-4 text-2xl md:text-4xl font-semibold tracking-px-n leading-tight">
          Your job postings
        </h3>

        <UButton color="indigo" :padded=false @click="postJob"
                 icon="i-heroicons-megaphone"
                 :class="['bg-indigo-700 px-2 py-1 sm:px-4 md:py-3']"
                 square label="Post a job"
                 variant="solid"/>
      </div>


      <keep-alive>
        <UTabs :items="tabs" class="w-full my-12">
          <template #item="{ item }">

            <div v-if="item.key === 'all'" class="space-y-3">
              <JobOffersList v-if="!!companyJobsResponse" :jobs="myJobPostings"
                             :jobs-response="companyJobsResponse"
                             class="my-10"/>
            </div>
            <div v-else-if="item.key === 'active'" class="space-y-3">
              <JobOffersList v-if="!!companyJobsResponse" :jobs="activeJobPostings"
                             :jobs-response="companyJobsResponse"
                             class="my-10"/>
            </div>
            <div v-else-if="item.key === 'expired'" class="space-y-3">
              <JobOffersList v-if="!!companyJobsResponse" :jobs="expiredJobPostings"
                             :jobs-response="companyJobsResponse"
                             class="my-10"/>
            </div>

          </template>
        </UTabs>
      </keep-alive>
    </section>
  </div>

</template>

<script setup lang="ts">
//@ts-ignore
import {useAuthStore} from "~/stores/auth";
import {useCompanyStore} from "~/stores/company";
import {storeToRefs} from "pinia";
import {AppRoutes} from "~/core/routes";
import {AnalyticsEvent} from "~/services/analytics/events";
import {AppAnalyticsProvider} from "~/services/analytics/app_analytics_provider";

definePageMeta({layout: 'app-layout', middleware: ['auth', 'no-company']})

useHead({title: "Flutter Gigs - My job postings"});

const companyStore = useCompanyStore()
const {$analytics} = useNuxtApp()

const tabs = [{
  key: 'all',
  label: 'All',
  description: 'All your job postings'
}, {
  key: 'active',
  label: 'Active',
  description: 'Active job postings'
}, {
  key: 'expired',
  label: 'Expired',
  description: 'Expired job postings'
}]

onMounted(() => {
  ($analytics as AppAnalyticsProvider).capture(AnalyticsEvent.myJobsPageEntered);
})

onBeforeMount(() => {
  companyStore.fetchMyJobs()
})

const postJob = () => {
  ($analytics as AppAnalyticsProvider).capture(AnalyticsEvent.postJobOfferButtonClicked,);

  navigateTo(AppRoutes.postJob)
}
const {myJobPostings, expiredJobPostings, activeJobPostings, companyJobsResponse} = storeToRefs(companyStore)
</script>

<style scoped>

</style>