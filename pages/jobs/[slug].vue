<script setup>

import {useJobStore} from "~/stores/job";
import {storeToRefs} from "pinia";
import {Endpoint} from "~/core/network/endpoints";
import {extractCompanyFromJob} from "~/features/jobs/transformers";
import {AnalyticsEvent} from "~/services/analytics/events";
import {userFacingCompanySize} from "~/features/companies/transformers";
import {AppRoutes} from "~/core/routes";
import useJobActions from '@/composables/useJobActions'
import {Direction} from "~/core/shared/types";
import CompanyInfoCard from "~/components/company/CompanyInfoCard.vue";
import {stringify} from "qs";
import WorkingPermits from "~/components/job/WorkingPermits.vue";
import SaveJobIconButton from "~/components/job/SaveJobIconButton.vue";

// TODO handle mobile responsiveness
//TODO handle account/dashboard/consultants

definePageMeta({
  layout: 'main-layout',
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
} = await useLazyFetch(`${useRuntimeConfig().public.apiBaseUrl}${Endpoint.jobOffers}?${query.value}`, {
  key: jobSlug.value,
  transform: (results) => {
    const job = results.data[0]
    return {
      ...job[`attributes`],
      id: job['id']
    }
  }
})
/*if (!data.value) {
  throw createError({
    statusCode: 404,
    statusMessage: 'Job Not Found',
  })
}*/

definePageMeta({layout: 'main-layout', title: `FlutterGis job opportunities`,})

useHead({title: `Get this opportunity on FlutterGigs: ${data.value?.title}`});

useServerSeoMeta({
  title: () => `Flutter Gigs - ${data.value?.title}`,
  ogUrl: 'https://fluttergigs.com',
  ogType: 'website',
  ogLocale: 'en_US',
  ogTitle: () => `Flutter Gigs - ${data.value?.title}`,
  ogImage: 'https://fluttergigs.com/fluttergigs-og.png',
  description: () => data.value?.description,
  ogDescription: () => data.value?.description,
  ogSiteName: 'Flutter Gigs - The #1 Flutter job platform',
  twitterCard: 'summary_large_image',
  twitterImage: () => data.value?.company?.logo ?? 'https://fluttergigs.com/fluttergigs-og.png',
  twitterSite: '@fluttergigs',
  twitterTitle: () => `Flutter Gigs - ${data.value?.title}`,
  twitterDescription: () => 'Find this opportunity on FlutterGigs:' + data.value?.description,
})

onMounted(() => {
  // if (import.meta.client)
  ($analytics).capture(AnalyticsEvent.jobOfferDetailEntered, {jobOffer: data ?? {}})
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
            class="bg-transparent text-indigo-700 border-none"
            label="" loading
            size="xl"
            variant="ghost"/>
      </div>
    </template>

    <template v-else>
      <section class="bg-blueGray-50 w-full relative">
        <div class="container px-4 md:x-20 py-6 md:py-14 mx-auto">
          <CompanyLogo :company="company" class="absolute left-[10px] md:left-16 top-[6px] md:top-18" size="3xl"/>
        </div>
      </section>
      <div class="px-4 md:px-20 py-20">
        <section class="bg-white">
          <div class="flex flex-col gap-5 items-start sm:flex-row sm:items-center sm:justify-between">
            <h2 class="text-xl md:text-5xl lg:text-7xl font-bold">
              {{ data?.title }}
            </h2>

            <client-only>
              <div class="flex flex-wrap space-x-2 items-center my-2">
                <UButton v-if="useJobActions().jobBelongsToCompany(company)"
                         color="white" icon="i-heroicons-pencil"
                         label="Edit job offer"
                         size="lg" square variant="solid"
                         @click="useCompanyActions().handleJobEdit(data)"/>

                <UButton color="white" icon="i-heroicons-share"
                         label="Share job offer"
                         size="lg" square variant="solid"
                         @click="useJobActions().shareJobOffer(data)"/>

                <SaveJobIconButton :company="company" :job="data"/>
              </div>
            </client-only>
          </div>

          <div class="flex flex-wrap gap-4 my-4">
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
              <a :href="company?.website" class="text-black font-medium" target="_blank">
                Website
              </a>
            </div>

            <WorkingPermits :countries="jobWorkingPermits(countriesData?.countries??[], data)"/>
          </div>
        </section>

        <!--      job details-->
        <section class="font-normal flex flex-col my-4 gap-x-16 md:flex-row">
          <div class="flex flex-col w-full md:w-4/6 space-y-10">
            <div class="space-y-10 text-gray-900 font-medium">
              <p class="leading-10">{{ company?.description }}</p>
              <p class="leading-10">{{ data?.description }}</p>
            </div>
            <!--          apply section-->
            <LazyJobApplicationCtaCard :company="company" :job="data" class="hidden md:block"/>
          </div>

          <div class="flex flex-col space-y-9 w-full md:w-2/6">
            <JobApplicationCtaCard
                :company="company"
                :job="data"
                :layout-direction='Direction.vertical'/>

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