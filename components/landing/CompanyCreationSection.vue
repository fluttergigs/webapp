<script lang="ts" setup>
  import { BuildingOfficeIcon, MegaphoneIcon } from '@heroicons/vue/24/solid';
  import CompanyPerk from '~/components/landing/CompanyPerk.vue';
  import { AppRoutes } from '~/core/routes';
  import { AnalyticsEvent } from '~/services/analytics/events';

  const postJob = () => {
    useAnalytics().capture(AnalyticsEvent.companyPerkPostJobButtonClicked);

    useCompanyActions().handleJobCreation();
  };

  const createCompany = () => {
    useAnalytics().capture(AnalyticsEvent.companyPerkCreateCompanyButtonClicked);
    navigateTo(AppRoutes.createCompany);
  };
</script>

<template>
  <section class="relative py-24 bg-blueGray-50 overflow-hidden">
    <img
      alt=""
      class="absolute left-1/2 bottom-0 transform translate-x-1/2"
      src="@/assets/images/gradient6.svg"
    />

    <div
      class="flex flex-col md:flex-row space-y-4 md:space-x-8 px-10 md:px-8 relative z-10 container mx-auto"
    >
      <div class="w-full md:w-1/3">
        <div class="flex flex-col">
          <p class="mb-6 text-sm text-indigo-600 font-bold uppercase tracking-px">For companies</p>

          <h2
            class="mb-16 text-4xl md:text-5xl xl:text-6xl font-bold font-heading tracking-px-n leading-none"
          >
            Hire talented Flutter Engineers
          </h2>

          <p class="font-medium text-gray-600 leading-relaxed">
            Attract top talent in minutes. Build your employer brand and reach thousands of
            motivated job seekers. Create your free company profile today!
          </p>
        </div>
      </div>
      <div class="w-full md:w-1/3">
        <CompanyPerk
          :icon="BuildingOfficeIcon"
          cta-text="Create your company profile"
          description="Craft a compelling company profile that showcases your remote work culture and attracts the best.
                      Job seekers come here to discover amazing remote opportunities."
          title="Profile"
          @cta-clicked="createCompany"
        />
      </div>
      <div class="w-full md:w-1/3">
        <CompanyPerk
          :icon="MegaphoneIcon"
          cta-text="Post your job"
          description="Reach top Flutter talents globally: Promote your remote jobs and connect with the world's best.
                     Find the right skills, fast: Specify requirements upfront to streamline your hiring process."
          title="Publish"
          @cta-clicked="postJob"
        >
        </CompanyPerk>
      </div>
    </div>
  </section>
</template>

<style scoped></style>
