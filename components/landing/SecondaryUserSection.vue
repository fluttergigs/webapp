<script setup lang="ts">
//@ts-ignore
import {MagnifyingGlassIcon, UserIcon} from "@heroicons/vue/24/solid";
import CompanyPerk from "~/components/landing/CompanyPerk.vue";
import {AppAnalyticsProvider} from "~/services/analytics/app_analytics_provider";
import {AnalyticsEvent} from "~/services/analytics/events";
import {AppRoutes} from "~/core/routes";

const {$analytics} = useNuxtApp()
const createAccount = () => {
  ($analytics as AppAnalyticsProvider).capture(AnalyticsEvent.userPerkCreateAccountButtonClicked,);

  return navigateTo(AppRoutes.login)
}

const findJobs = () => {
  ($analytics as AppAnalyticsProvider).capture(AnalyticsEvent.userPerkFindJobsButtonClicked,);
  navigateTo(AppRoutes.jobs)
}
</script>

<template>
  <section class="relative py-32 md:py-24 bg-blueGray-50">
    <div
        class="flex flex-col md:flex-row w-full space-y-4 md:space-x-8 px-10 md:px-8 relative container mx-auto my-8 md:my-0">

      <div class="w-full md:w-1/3">
        <CompanyPerk
            @cta-clicked="createAccount"
            cta-text="Create your account"
            title="Profile"
            description="Create your account to track job offers and showcase your skills.
                      Companies will see your profile and connect with you."
            :icon="UserIcon"/>
      </div>
      <div class="w-full md:w-1/3">
        <CompanyPerk
            @cta-clicked="findJobs"
            title="Find"
            cta-text="Find your opportunity"
            description="Find your next Flutter opportunity in a matter of seconds. We bridge the gap between you and your next Flutter job "
            :icon="MagnifyingGlassIcon">
        </CompanyPerk>
      </div>

      <div class="w-full md:w-1/3">
        <div class="flex flex-col">
          <p class="mb-6 text-sm text-indigo-600 font-bold uppercase tracking-px">
            For job seekers
          </p>

          <h2
              class="mb-16 text-4xl md:text-5xl xl:text-6xl font-bold font-heading tracking-px-n leading-none">
            Find awesome opportunities
          </h2>

          <p class="font-medium text-gray-600 leading-relaxed">
            Find your dream Flutter job and more today. Build your profile and reach thousands of opportunities.
            Create your free profile today!
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>

</style>