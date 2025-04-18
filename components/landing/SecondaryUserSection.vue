<script lang="ts" setup>
  //@ts-ignore
  import { MagnifyingGlassIcon, UserIcon } from '@heroicons/vue/24/solid';
  import { AppRoutes } from '~/core/routes';
  import { AppAnalyticsProvider } from '~/services/analytics/AppAnalyticsProvider';
  import { AnalyticsEvent } from '~/services/analytics/events';

  const { $analytics } = useNuxtApp();
  const createAccount = () => {
    ($analytics as AppAnalyticsProvider).capture(AnalyticsEvent.userPerkCreateAccountButtonClicked);

    return navigateTo(AppRoutes.login);
  };

  const findJobs = () => {
    ($analytics as AppAnalyticsProvider).capture(AnalyticsEvent.userPerkFindJobsButtonClicked);
    navigateTo(AppRoutes.jobs);
  };
</script>

<template>
  <section class="relative py-32 md:py-24 bg-blueGray-50">
    <div
      class="flex flex-col md:flex-row w-full space-y-4 md:space-x-8 px-10 md:px-8 relative container mx-auto my-8 md:my-0"
    >
      <div class="w-full md:w-1/3">
        <CompanyPerk
          :icon="UserIcon"
          cta-text="Create your account"
          description="Create your account to track job offers and showcase your skills.
                      Companies will see your profile and connect with you."
          title="Profile"
          @cta-clicked="createAccount"
        />
      </div>
      <div class="w-full md:w-1/3">
        <CompanyPerk
          :icon="MagnifyingGlassIcon"
          cta-text="Find your opportunity"
          description="Find your next Flutter opportunity in a matter of seconds. We bridge the gap between you and your next Flutter job "
          title="Find"
          @cta-clicked="findJobs"
        >
        </CompanyPerk>
      </div>

      <div class="w-full md:w-1/3">
        <div class="flex flex-col">
          <p class="mb-6 text-sm text-indigo-600 font-bold uppercase tracking-px">
            For job seekers
          </p>

          <h2
            class="mb-16 text-4xl md:text-5xl xl:text-6xl font-bold font-heading tracking-px-n leading-none"
          >
            Find awesome opportunities
          </h2>

          <p class="font-medium text-gray-600 leading-relaxed">
            Find your dream Flutter job and more today. Build your profile and reach thousands of
            opportunities. Create your free profile today!
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped></style>
