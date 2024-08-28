<script setup lang="ts">

import {MegaphoneIcon, UserIcon} from "@heroicons/vue/24/solid";
import CompanyPerk from "~/components/landing/CompanyPerk.vue";
import {AppAnalyticsProvider} from "~/services/analytics/app_analytics_provider";
import {AnalyticsEvent} from "~/services/analytics/events";
import {AppRoutes} from "~/core/routes";

const {$analytics} = useNuxtApp()
const createAccount = () => {
  ($analytics as AppAnalyticsProvider).capture(AnalyticsEvent.userPerkCreateAccountButtonClicked,);

  return navigateTo(AppRoutes.login)
}

const createCompany = () => {
  ($analytics as AppAnalyticsProvider).capture(AnalyticsEvent.companyPerkCreateCompanyButtonClicked,);
  navigateTo(AppRoutes.createCompany)
}
</script>

<template>
  <section class="relative py-24 bg-blueGray-50">
    <img
        class="absolute overflow-hidden left-1/2 bottom-0 transform -translate-x-1/2"
        src="@/assets/images/gradient6.svg"
        alt=""
    />

    <div
        class="flex flex-col md:flex-row w-full space-x-8 px-8 relative z-10 container mx-auto">

      <!--      TODO: change text for the second box-->
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
            @cta-clicked="createAccount"
            title="Publish"
            cta-text="Post your job"
            description="Reach top Flutter talents globally: Promote your remote jobs and connect with the world's best.
                     Find the right skills, fast: Specify requirements upfront to streamline your hiring process."
            :icon="MegaphoneIcon">
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