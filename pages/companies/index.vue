<script lang="ts" setup>
import {storeToRefs} from "pinia";
import {useCompanyStore} from "~/stores/company";
import {AnalyticsEvent} from "~/services/analytics/events";
import type {AppAnalyticsProvider} from "~/services/analytics/app_analytics_provider";
import CompanyFiltersWidget from "~/components/company/FiltersWidget.vue";
import CompanyList from "~/components/company/CompanyList.vue";

definePageMeta({
  layout: 'main-layout',
  keepalive: true,
  middleware: [
    function (to: any, from: any) {
      /* if (!useFeatureFlags().isEnabled(AvailableFlags.companiesList)) {

         const {$toast} = useNuxtApp();
         ($toast as BaseToast<Notification>).info(AppStrings.featureAvailableSoon)
         return navigateTo(from)
       }*/
    }
  ]
})

useHead({title: `Flutter Gigs - Browse companies`});

const {$analytics} = useNuxtApp()
const {filteredCompanies, companyFiltersResponse} = storeToRefs(useCompanyStore())

onMounted(() => {
  ($analytics as AppAnalyticsProvider).capture(AnalyticsEvent.findCompanyPageEntered);

  useSeoMeta({
    title: `FlutterGigs' available companies`,
    ogTitle: 'Browse thousands of companies',
    description: 'FlutterGigs is the #1 job board in the Flutter community',
    ogDescription: 'FlutterGigs is the #1 job board in the Flutter community',
    twitterCard: 'summary_large_image',
  })
})
</script>

<template>
  <section class="relative bg-hero-gradient">
    <img
        alt=""
        class="absolute left-1/2 bottom-0 transform"
        src="@/assets/images/gradient6.svg"
    />
    <div class="container px-4 py-16 mx-auto">
      <div class="flex flex-col -m-8">
        <h1 class="mb-6 text-5xl md:text-6xl lg:text-6xl font-semibold text-gray-900">
          Great companies
        </h1>

        <p class="mb-11 text-lg text-gray-700 font-medium max-w-2xl">
          Unleash your work-from-anywhere potential! Explore top remote companies and their cultures, missions, and open
          positions.
        </p>
      </div>
    </div>
  </section>

  <section class="flex bg-gradient-white px-20 py-14 w-full mx-auto">
    <div class="w-full md:w-1/6">
      <CompanyFiltersWidget/>

    </div>
    <div class="w-full md:w-4/6">
      <CompanyList v-if="!!companyFiltersResponse" :companies="filteredCompanies"
                   :companies-response="companyFiltersResponse" class="md:mx-8"/>
    </div>
  </section>

</template>

<style scoped>

</style>