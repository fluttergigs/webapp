<script setup lang="ts">

import KeywordFilter from "~/components/job/KeywordFilter.vue";
import WorkTypeFilter from "~/components/job/WorkTypeFilter.vue";
import SeniorityLevelFilter from "~/components/job/SeniorityLevelFilter.vue";
import RemoteOptionsFilter from "~/components/job/RemoteFilter.vue";
import {useJobStore} from "~/stores/job";
</script>

<template>
  <section>
    <p class="mb-4 text-lg text-gray-900 font-semibold">
      Filters
    </p>
    <div class="flex flex-col space-y-6">
      <KeywordFilter @filterByKeyword="(value)=> useJobStore().setJobSearchFilters({keyword: value})"/>
      <WorkTypeFilter @filterByWorkType="(value)=> useJobStore().setJobSearchFilters({workType: value})"/>
      <SeniorityLevelFilter @filterBySeniorityLevel="(value)=> useJobStore().setJobSearchFilters({seniorityLevel: value})"/>
      <RemoteOptionsFilter @filterByRemoteOptions="(value)=> useJobStore().setJobSearchFilters({remoteOption: value})"/>
    </div>
  </section>

</template>

<style scoped>

</style>