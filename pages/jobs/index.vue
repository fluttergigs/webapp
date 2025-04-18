<template>

  <main>

    <section class="relative bg-blueGray-50">
      <img
        alt=""
        class="absolute bottom-0 left-1/2 transform"
        src="@/assets/images/gradient6.svg"
      />
      <div class="container mx-auto px-4 py-16">
        <div class="flex flex-col items-center justify-center p-8">
          <h1
            class="primary-gradient mb-6 text-5xl font-bold md:text-6xl lg:text-6xl"
          >
            FlutterGigs
          </h1>

          <p class="mb-11 text-center text-lg font-medium text-gray-900">
            Discover the best Flutter opportunities and more at top remote
            companies around the world.
          </p>
        </div>
      </div>
    </section>

    <section class="mx-auto flex w-full flex-wrap bg-gradient-white px-6 py-6 sm:px-12 md:px-20 md:py-14">
      <div class="w-full md:w-1/6">
        <FiltersWidget />
      </div>
      <div class="my-4 w-full sm:w-5/6 md:my-0 md:w-4/6">
        <JobOffersList
          v-if="!!jobFiltersResponse"
          :jobs="filteredJobs"
          :jobs-response="jobFiltersResponse"
          class="md:mx-8"
        >
          <template #default="{ job }">
            <JobCard v-if="isMediumScreen" :job="job" />

            <JobCardDetailed v-else :job="job" />
          </template>
        </JobOffersList>
      </div>
    </section>
  </main>

</template>

<script setup>
  import FiltersWidget from '~/components/job/FiltersWidget.vue';
  import JobOffersList from '~/components/job/JobOffersList.vue';
  import { AnalyticsEvent } from '~/services/analytics/events';
  import { storeToRefs } from 'pinia';
  import { useJobStore } from '~/stores/job';
  import { useMediaQuery } from '@vueuse/core';
  import { useUserStore } from '~/stores/user';

  definePageMeta({
    layout: 'main-layout',
    keepalive: true,
    title: 'Browse available Flutter opportunities and more',
  });

  useSeoMeta({
    title: `FlutterGigs - The #1 Job Board in the Flutter community`,
    ogTitle: 'Browse thousands of jobs',
    description: 'FlutterGigs is the #1 job board in the Flutter community',
    ogDescription: 'FlutterGigs is the #1 job board in the Flutter community',
    twitterCard: 'summary',
    twitterDescription: 'FlutterGigs is the #1 job board in the Flutter community',
    ogImageUrl: 'https://fluttergigs.com/fluttergigs-og-1.png',
    twitterImage: 'https://fluttergigs.com/fluttergigs-og-1.png',
  });

  const { $analytics } = useNuxtApp();
  const { filteredJobs, jobFiltersResponse } = storeToRefs(useJobStore());

  const isMediumScreen = useMediaQuery('(min-width: 768px)');

  onMounted(async () => {
    $analytics.capture(AnalyticsEvent.findJobOfferPageEntered);

    await useUserStore().fetchBookmarkedJobOffers();
  });
</script>

<style scoped></style>
