<script setup lang="ts">

import {useJobStore} from "~/stores/job";
import {storeToRefs} from "pinia";
import {Endpoint} from "~/core/network/endpoints";
import {extractCompanyFromJob} from "~/features/jobs/transformers";
import type {AppAnalyticsProvider} from "~/services/analytics/app_analytics_provider";
import {AnalyticsEvent} from "~/services/analytics/events";
import {userFacingCompanySize} from "~/features/companies/transformers";
import {AppRoutes} from "~/core/routes";
import useJobActions from '@/composables/useJobActions'
import JobApplicationCtaCard from "~/components/job/JobApplicationCtaCard.vue";
import {Direction} from "~/core/shared/types";

definePageMeta({
  layout: 'main-layout'
})

const {$analytics} = useNuxtApp()

const {currentViewedJob} = storeToRefs(useJobStore())

const company = computed(() => ({
  ...extractCompanyFromJob(currentViewedJob.value)
}));

const {
  data,
  error,
  pending
} = await useFetch(`${useRuntimeConfig().public.apiBaseUrl}${Endpoint.jobOffers}`, {
  immediate: true,
  //@ts-ignore
  query: {
    populate: '*',
    filter: {
      slug: {
        $eq: useRoute().params.slug
      }
    },
  },
  transform:
      (results) => {
        const job = results.data[0]
        return {
          ...job[`attributes`],
          id: job['id']
        }
      }
})

onMounted(() => {
  ($analytics as AppAnalyticsProvider).capture(AnalyticsEvent.jobOfferDetailEntered, {jobOffer: data})
  useJobStore().setSelectedJob(data)
})
</script>

<template>
  <client-only>

    <template v-if="pending">
      <div class="flex items-center justify-center p-52">
        <UButton
            variant="ghost"
            size="xl" label=""
            class="bg-transparent text-indigo-700 border-none"
            loading/>
      </div>

    </template>

    <template v-else>
      <section class="bg-blueGray-50 w-full relative">
        <div class="container px-14 py-6 md:py-14 mx-auto">
          <img
              class="w-24 h-22 shadow-sm rounded-full absolute left-12 top-16"
              src="@/assets/images/avatar-circle.png"/>
        </div>
      </section>
      <div class="px-14 py-20">
        <section class="bg-white">
          <div class="flex items-center justify-between">
            <h2 class="text-xl md:text-5xl lg:text-7xl font-bold">
              {{ data?.title }}
            </h2>

            <client-only>
              <UButton @click="useJobActions().shareJobOffer(data)" size="lg"
                       icon="i-heroicons-share"
                       square label="Share job offer" color="white"
                       variant="solid"/>
            </client-only>

          </div>

          <div class="flex space-x-4">
            <a :href="AppRoutes.companyPage(company.id)" class="text-lg text-gray-900 font-medium">{{
                company?.name
              }}</a>

            <div class="flex items-center space-x-1">
              <UIcon class="text-gray-600" name="i-heroicons-building-office"/>
              <span class="text-black font-medium">
            {{ userFacingCompanySize(company?.size) }}
          </span>
            </div>

            <div class="flex items-center space-x-1">
              <UIcon class="text-gray-600" name="i-heroicons-link"/>
              <a class="text-black font-medium" :href="company?.website" target="_blank">
                Website
              </a>
            </div>
          </div>
        </section>

        <!--      job details-->
        <section class="font-normal flex flex-col my-4 gap-x-16 xl:flex-row">
          <div class="flex flex-col flex-shrink-0 xl:w-[48rem] space-y-10">
            <div class="space-y-10">
              <p class="leading-10">{{ company?.description }}</p>
              <p class="leading-10">{{ currentViewedJob?.description }}</p>
            </div>

            <!--          apply section-->
            <JobApplicationCtaCard :job="data" :company="company"/>
          </div>

          <div class="flex flex-col space-y-8">
            <JobApplicationCtaCard
                :layout-direction="Direction.vertical"
                :job="data"
                :company="company"/>
          </div>
        </section>
      </div>
    </template>

  </client-only>

</template>

<style scoped>

</style>