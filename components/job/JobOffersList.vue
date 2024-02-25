<script setup lang="ts">
import {useJobStore} from "~/stores/job";
import {storeToRefs} from "pinia";

const jobStore = useJobStore()

const {filteredJobs, jobFiltersResponse} = storeToRefs(jobStore)

</script>


<template>

  <div class="flex flex-col space-y-4">
    <client-only>
      <JobCard v-if="jobFiltersResponse.isSuccess" v-for="job in filteredJobs" :job="job" :key="job.id"/>
      <div v-else-if="jobFiltersResponse.isLoading">

        <div v-for="_ in 5">
          <USkeleton class="flex h-[100px] w-full mb-3"/>
        </div>
      </div>
    </client-only>
  </div>

</template>

<style scoped>

</style>