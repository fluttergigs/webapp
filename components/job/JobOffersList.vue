<script setup lang="ts">
import {useJobStore} from "~/stores/job";
import {storeToRefs} from "pinia";
import {defaultShimmerListItemsCount} from "~/core/constants";

const jobStore = useJobStore()

const {filteredJobs, jobFiltersResponse} = storeToRefs(jobStore)

const {searchFilters} = storeToRefs(jobStore)


watch(searchFilters, () => {

})

</script>

<template>
  <div class="flex flex-col space-y-4">
    <client-only>


      <template v-if="jobFiltersResponse.isSuccess">

        <JobCard v-if="filteredJobs.length > 0" v-for="job in filteredJobs" :job="job" :key="job.slug"/>
        <div class="flex items-center justify-center" v-else>
          <img class="w-96 h-96" alt="Empty job results" src="@/assets/images/emptyJobFiltersResult.svg"/>
        </div>

      </template>
      <div v-else-if="jobFiltersResponse.isLoading">

        <div v-for="_ in defaultShimmerListItemsCount">
          <USkeleton class="flex h-[100px] w-full mb-3"/>
        </div>
      </div>
    </client-only>
  </div>
</template>

<style scoped>

</style>