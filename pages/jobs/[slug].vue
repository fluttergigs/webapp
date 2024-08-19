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
import {Direction} from "~/core/shared/types";
import CompanyInfoCard from "~/components/company/CompanyInfoCard.vue";
import {stringify} from "qs";
import WorkingPermits from "~/components/job/WorkingPermits.vue";
import SaveJobIconButton from "~/components/job/SaveJobIconButton.vue";


definePageMeta({
  layout: 'main-layout'
})

const {$analytics} = useNuxtApp()

const {currentViewedJob} = storeToRefs(useJobStore())

const company = computed(() => ({
  ...extractCompanyFromJob(data.value)
}));

const jobSlug = ref(useRoute().params.slug)

const {data: countriesData, error: countriesError} = await useCountries();
const {jobWorkingPermits} = useJobActions();

const query = ref(stringify({
  populate: '*',
  filters: {
    slug: {
      $eq: jobSlug.value,
    }
  },
}, {encodeValuesOnly: true}))

const {
  data,
  error,
  pending
} = await useFetch(`${useRuntimeConfig().public.apiBaseUrl}${Endpoint.jobOffers}?${query.value}`, {
  transform: (results) => {
    const job = results.data[0]
    return {
      ...job[`attributes`],
      id: job['id']
    }
  }
})

useHead({title: `Flutter Gigs - ${data.value?.title}`});
useSeoMeta({
  title: () => `Flutter Gigs - ${data.value?.title}`,
  ogTitle: () => `Flutter Gigs - ${data.value?.title}`,
  description: () => data.value?.description,
  ogDescription: () => data.value?.description,
  ogSiteName: 'Flutter Gigs',
  twitterCard: 'summary_large_image',
  twitterImage: () => data.value?.company?.logo,
  twitterSite: '@fluttergigs',
  twitterTitle: () => `Flutter Gigs - ${data.value?.title}`,
  twitterDescription: () => 'Find this opportunity on FlutterGigs:' + data.value?.description,
})


onMounted(() => {
  ($analytics as AppAnalyticsProvider).capture(AnalyticsEvent.jobOfferDetailEntered, {jobOffer: data})
})

onBeforeMount(() => {
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
        <div class="container px-20 py-6 md:py-14 mx-auto">
          <CompanyLogo :company="company" size="3xl" class="absolute left-16 top-18"/>
        </div>
      </section>
      <div class="px-20 py-20">
        <section class="bg-white">
          <div class="flex flex-col items-start sm:flex-row sm:items-center sm:justify-between">
            <h2 class="text-xl md:text-5xl lg:text-7xl font-bold">
              {{ data?.title }}
            </h2>

            <client-only>
              <div class="flex space-x-2 items-center">
                <UButton v-if="useJobActions().jobBelongsToCompany(company)"
                         @click="useJobActions().editJobOffer(data)" size="lg"
                         icon="i-heroicons-pencil"
                         square label="Edit job offer" color="white"
                         variant="solid"/>

                <UButton @click="useJobActions().shareJobOffer(data)" size="lg"
                         icon="i-heroicons-share"
                         square label="Share job offer" color="white"
                         variant="solid"/>

                <SaveJobIconButton :job="data" :company="company"/>
              </div>
            </client-only>
          </div>

          <div class="flex space-x-4 my-2">
            <a :href="AppRoutes.companyPage(company.id)" class="text-lg text-gray-900 font-medium">
              {{ company?.name }}
            </a>

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

            <WorkingPermits :countries="jobWorkingPermits(countriesData?.countries??[], data)"/>

          </div>
        </section>

        <!--      job details-->
        <section class="font-normal flex flex-col my-4 gap-x-16 md:flex-row">
          <div class="flex flex-col flex-shrink-0 w-full md:max-w-3xl space-y-10">
            <div class="space-y-10 text-gray-900 font-medium">
              <p class="leading-10">{{ company?.description }}</p>
              <p class="leading-10">{{ data?.description }}</p>
            </div>

            <!--          apply section-->
            <LazyJobApplicationCtaCard class="hidden md:block" :job="data" :company="company"/>
          </div>

          <div class="flex flex-col space-y-9 w-full">
            <JobApplicationCtaCard
                :layout-direction='Direction.vertical'
                :job="data"
                :company="company"/>

            <JobDetailsCard :job="data"/>

            <CompanyInfoCard :company="company"/>
          </div>
        </section>
      </div>
    </template>

  </client-only>
</template>

<style scoped>

</style>