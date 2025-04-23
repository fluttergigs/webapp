<template>
  <main class="w-full">
    <div class="flex flex-col w-full">
      <section class="py-8 px-2 md:py-12 xl:pb-56 bg-white overflow-hidden">
        <div class="flex justify-between items-center">
          <h3 class="mb-4 text-xl md:text-3xl font-semibold tracking-px-n leading-tight">
            Your saved jobs
          </h3>
        </div>

        <keep-alive>
          <UTabs :items="tabs" class="w-full my-12">
            <template #all="{ item }">
              <JobOffersList
                v-if="!!bookmarkedJobsListResponse"
                :jobs="bookmarkedJobs"
                :jobs-response="bookmarkedJobsListResponse"
                class="my-10"
              >
                <template #cta>
                  <UButton :to="AppRoutes.jobs" label="Browse available jobs" />
                </template>
              </JobOffersList>
            </template>

            <!--            active-->
            <template #active="{ item }">
              <JobOffersList
                v-if="!!bookmarkedJobsListResponse"
                :jobs="activeBookmarkedJobs"
                :jobs-response="bookmarkedJobsListResponse"
                class="my-10"
              >
                <template #cta>
                  <UButton :to="AppRoutes.jobs" label="Browse available jobs" />
                </template>
              </JobOffersList>
            </template>

            <!--            expired-->
            <template #expired="{ item }">
              <JobOffersList
                v-if="!!bookmarkedJobsListResponse"
                :jobs="expiredBookmarkedJobs"
                :jobs-response="bookmarkedJobsListResponse"
                class="my-10"
              >
                <template #cta>
                  <UButton :to="AppRoutes.jobs" label="Browse available jobs" />
                </template>
              </JobOffersList>
            </template>
          </UTabs>
        </keep-alive>
      </section>
    </div>
  </main>
</template>

<script setup>
  import { storeToRefs } from 'pinia';
  import { AppRoutes } from '~/core/routes';
  import { AnalyticsEvent } from '~/services/analytics/events';
  import { useUserStore } from '~/stores/user';

  definePageMeta({ layout: 'app-layout', middleware: ['auth'] });

  useHead({ title: 'FlutterGigs - My saved jobs' });

  const userStore = useUserStore();
  const { $analytics } = useNuxtApp();

  const tabs = [
    {
      slot: 'all',
      label: 'All',
      description: 'All your saved jobs',
    },
    {
      slot: 'active',
      label: 'Active',
      description: 'Active saved jobs',
    },
    {
      slot: 'expired',
      label: 'Expired',
      description: 'Expired saved jobs',
    },
  ];

  onMounted(() => {
    $analytics.capture(AnalyticsEvent.mySavedJobsPageEntered);
  });

  onBeforeMount(() => {
    userStore.fetchBookmarkedJobOffers();
  });

  const {
    activeBookmarkedJobs,
    expiredBookmarkedJobs,
    bookmarkedJobs,
    bookmarkedJobsListResponse,
  } = storeToRefs(userStore);
</script>

<style scoped></style>
