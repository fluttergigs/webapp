<script lang="ts" setup>
  //@ts-ignore
  import { watchDebounced } from '@vueuse/core';
  import { storeToRefs } from 'pinia';
  import RemoteOptionsFilter from '~/components/job/RemoteFilter.vue';
  import SeniorityLevelFilter from '~/components/job/SeniorityLevelFilter.vue';
  import WorkPermitSelector from '~/components/job/WorkPermitSelector.vue';
  import WorkTypeFilter from '~/components/job/WorkTypeFilter.vue';
  import type { Country } from '~/core/shared/types';
  import { RemoteOptions, SeniorityLevel, WorkType } from '~/features/jobs/job.types';
  import { useJobStore } from '~/stores/job';

  const jobStore = useJobStore();
  const { searchFilters } = storeToRefs(jobStore);

  watchDebounced(
    searchFilters,
    async () => {
      await jobStore.filterJobs();
    },
    { debounce: 800, maxWait: 2000, rejectOnCancel: true },
  );

  const getSelectedCountries = (data: { countries: [Country] }) => {
    const countries = data.countries.map((country) => country.iso);

    jobStore.setJobSearchFilters({ countries });
  };
</script>

<template>
  <section>
    <p class="mb-4 text-lg text-gray-900 font-semibold">Job Filters</p>
    <div class="flex flex-col space-y-6">
      <JobKeywordFilter
        @filterByKeyword="(value: string) => jobStore.setJobSearchFilters({ keyword: value })"
      />
      <WorkTypeFilter
        @filterByWorkType="(value: WorkType) => jobStore.setJobSearchFilters({ workType: value })"
      />
      <SeniorityLevelFilter
        @filterBySeniorityLevel="
          (value: SeniorityLevel) => jobStore.setJobSearchFilters({ seniorityLevel: value })
        "
      />
      <RemoteOptionsFilter
        @filterByRemoteOptions="
          (value: RemoteOptions) => jobStore.setJobSearchFilters({ remoteOption: value })
        "
      />
      <WorkPermitSelector @selected-countries="getSelectedCountries" />
    </div>
  </section>
</template>

<style scoped></style>
