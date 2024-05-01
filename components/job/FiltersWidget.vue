<script setup lang="ts">

import WorkTypeFilter from "~/components/job/WorkTypeFilter.vue";
import SeniorityLevelFilter from "~/components/job/SeniorityLevelFilter.vue";
import RemoteOptionsFilter from "~/components/job/RemoteFilter.vue";
import {useJobStore} from "~/stores/job";
import {storeToRefs} from "pinia";
//@ts-ignore
import {watchDebounced} from "@vueuse/core";
import WorkPermitSelector from "~/components/job/WorkPermitSelector.vue";
import type {Country} from "~/core/shared/types";

const jobStore = useJobStore()
const {searchFilters} = storeToRefs(jobStore)

watchDebounced(
    searchFilters,
    async () => {
      await jobStore.filterJobs()
    },
    {debounce: 800, maxWait: 2000, rejectOnCancel: true,},
)

const getSelectedCountries = (data: {
  countries: [Country]
}) => {

  const countries = data.countries.map((country) => country.iso)

  jobStore.setJobSearchFilters({countries})
}
</script>

<template>
  <section>
    <p class="mb-4 text-lg text-gray-900 font-semibold">
      Job Filters
    </p>
    <div class="flex flex-col space-y-6">
      <JobKeywordFilter @filterByKeyword="(value)=> jobStore.setJobSearchFilters({keyword: value})"/>
      <WorkTypeFilter @filterByWorkType="(value)=> jobStore.setJobSearchFilters({workType: value})"/>
      <SeniorityLevelFilter
          @filterBySeniorityLevel="(value)=> jobStore.setJobSearchFilters({seniorityLevel: value})"/>
      <RemoteOptionsFilter @filterByRemoteOptions="(value)=> jobStore.setJobSearchFilters({remoteOption: value})"/>
      <WorkPermitSelector @selected-countries="getSelectedCountries"/>
    </div>
  </section>
</template>

<style scoped>

</style>