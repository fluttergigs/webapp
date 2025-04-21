<script lang="ts" setup>
  //@ts-ignore
  import type { PropType } from '@vue/runtime-core';
  import { useMediaQuery } from '@vueuse/core';
  import { storeToRefs } from 'pinia';
  import JobOffersList from '~/components/job/JobOffersList.vue';
  import type { Company } from '~/features/companies/company.types';
  import { useCompanyStore } from '~/stores/company';

  //@ts-ignore
  const props = defineProps({
    company: {
      type: Object as PropType<Company>,
      required: true,
    },
  });

  const { viewedCompanyJobs, viewedCompanyJobsResponse } = storeToRefs(useCompanyStore());
  const isMediumScreen = useMediaQuery('(min-width: 768px)');
</script>

<template>
  <div class="flex flex-col gap-x-16 lg:flex-row">
    <div class="flex-shrink-0 lg:w-[70rem]">
      <div class="flex flex-col space-y-4">
        <h3 class="mb-4 text-2xl font-medium text-gray-900 md:mb-5">
          {{ viewedCompanyJobs?.length }} Jobs at {{ company.name }}
        </h3>

        <JobOffersList :jobs="viewedCompanyJobs" :jobs-response="viewedCompanyJobsResponse">
          <template #default="{ job }">
            <JobCard v-if="isMediumScreen" :job="job" />

            <JobCardDetailed v-else :job="job" />
          </template>
        </JobOffersList>
      </div>
    </div>
    <CompanyInfoCard :company="company" :show-view-profile-button="false" class="w-full" />
  </div>
</template>

<style scoped></style>
