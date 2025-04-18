<script lang="ts" setup>
  import { storeToRefs } from 'pinia';
  import { AppRoutes } from '~/core/routes';
  import { AppAnalyticsProvider } from '~/services/analytics/AppAnalyticsProvider';
  import { AnalyticsEvent } from '~/services/analytics/events';
  import { useJobStore } from '~/stores/job';

  const { landingPageJobs } = storeToRefs(useJobStore());

  const findJobs = () => {
    (useNuxtApp().$analytics as AppAnalyticsProvider).capture(
      AnalyticsEvent.landingPageUserSectionFindJobsButtonClicked,
    );
    navigateTo(AppRoutes.jobs);
  };
</script>

<template>
  <section class="relative py-16 bg-blueGray-100 overflow-hidden w-full">
    <img
      alt=""
      class="absolute left-1/2 bottom-0 transform translate-x-1/4"
      src="@/assets/images/gradient6.svg"
    />
    <div class="relative container sm:px-10 px-4 py-8 mx-auto">
      <p class="mb-6 text-sm text-indigo-600 font-bold uppercase tracking-px">For job seekers</p>

      <div class="md:flex md:justify-between">
        <div class="md:max-w-2xl">
          <h2 class="mb-5 text-5xl md:text-6xl font-bold font-heading tracking-px-n leading-tight">
            Find your dream Flutter job today
          </h2>
          <p class="mb-20 text-gray-600 font-medium leading-relaxed md:max-w-md">
            Looking for a Flutter gig? Look no further! FlutterGigs has everything you need to find
            your dream gig today.
          </p>
        </div>
        <UButton
          class="bg-indigo-700 w-full md:w-auto"
          color="indigo"
          label="Find jobs"
          size="xl"
          style="height: fit-content"
          @click="findJobs"
        />
      </div>

      <div
        v-if="landingPageJobs"
        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 gap-3 my-4"
      >
        <JobCardDetailed v-for="job in landingPageJobs" :key="job.slug" :job="job" />
      </div>
    </div>
  </section>
</template>

<style scoped></style>
