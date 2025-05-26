<template>
  <main>
    <header class="pattern-bg relative">
      <div class="container mx-auto flex flex-col-reverse items-center gap-12 px-6 lg:flex-row">
        <!-- Text Content -->
        <div class="text-center lg:w-7/12 lg:text-left">
          <h1 class="mb-4 text-4xl font-extrabold leading-tight lg:text-5xl">
            Discover Awesome<br />
            <span class="primary-gradient"> Flutter opportunies</span>
          </h1>
          <p class="mb-8 text-xl text-gray-600">
            FlutterGigs connects you with the best opportunities and talents <br />
            in the Flutter ecosystem.
          </p>
        </div>
        <!-- Code Snippet Preview -->
        <div class="w-full lg:w-5/12">
          <img class="w-6/9" src="/landing-header.webp" />
        </div>
      </div>
    </header>

    <section class="mx-auto flex w-full flex-wrap py-10 px-2 md:px-16 pattern-bg">
      <div class="my-4 w-full sm:w-5/6 md:my-0 md:w-4/6">
        <div class="flex flex-col gap-4 justify-center">
          <JobOffersList
            v-if="!!jobFiltersResponse"
            :jobs="paginatedJobs"
            :jobs-response="jobFiltersResponse"
            class="md:mx-8"
          >
            <template #default="{ job }">
              <JobCard v-if="isMediumScreen" :job="job" />

              <JobCardDetailed v-else :job="job" />
            </template>
          </JobOffersList>

          <UPagination
            v-if="filteredJobs.length > 0"
            v-model:page="currentPage"
            :items-per-page="MAX_JOBS_PER_PAGE"
            :total="filteredJobs.length"
            class="self-center"
          />
        </div>
      </div>
      <div class="w-full md:w-1/6">
        <FiltersWidget />
      </div>
    </section>
  </main>
</template>

<script setup>
  import { useMediaQuery } from '@vueuse/core';
  import { storeToRefs } from 'pinia';
  import FiltersWidget from '~/components/job/FiltersWidget.vue';
  import JobOffersList from '~/components/job/JobOffersList.vue';
  import { useJob } from '~/composables/useJob';
  import { AnalyticsEvent } from '~/services/analytics/events';
  import { useJobStore } from '~/stores/job';
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

  const { paginatedJobs, currentPage, totalPages } = useJob();

  const isMediumScreen = useMediaQuery('(min-width: 768px)');

  onMounted(async () => {
    $analytics.capture(AnalyticsEvent.findJobOfferPageEntered);

    if (useUser().isAuthenticated.value) {
      await useUserStore().fetchBookmarkedJobOffers();
    }
  });
</script>

<style scoped></style>
