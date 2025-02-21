<script setup>
import {useJobStore} from "~/stores/job";
import {defaultShimmerListItemsCount} from "~/core/constants";

const jobStore = useJobStore()

const props = defineProps({
  jobs: {
    type: Array,
    default: () => []
  },
  jobsResponse: {
    type: Object,
    required: true,
  }
})
</script>

<template>
  <div class="flex flex-col space-y-4">
    <client-only>
      <template v-if="props.jobsResponse.isFailure">
        <div class="flex flex-col items-center justify-center">
          <slot name="error">
            <div class="flex flex-col items-center space-y-2">
              <p>Unable to fetch jobs in the list</p>
              <img alt="Empty job results" class="w-96 h-96" src="@/assets/images/emptyJobFiltersResult.svg"/>
            </div>
          </slot>
          <slot name="ctaError">
          </slot>
        </div>

      </template>

      <div v-else-if="props.jobsResponse.isLoading">
        <slot name="loader">
          <div v-for="_ in defaultShimmerListItemsCount">
            <USkeleton class="flex h-[95px] w-full mb-3"/>
          </div>
        </slot>
      </div>


      <template v-else>
        <div v-if="props.jobs.length === 0" class="flex flex-col items-center justify-center">
          <slot name="noData">
            <div class="flex flex-col items-center space-y-2">
              <p>No jobs found in the list</p>
              <img alt="Empty job results" class="w-96 h-96" src="@/assets/images/emptyJobFiltersResult.svg"/>
            </div>
          </slot>
          <slot name="cta">
          </slot>
        </div>

        <template v-else>
          <slot v-for="job in props.jobs" :key="job.slug" :job="job">
            <JobCard :key="job.slug" :job="job"/>
          </slot>
        </template>
      </template>

    </client-only>
  </div>
</template>

<style scoped>

</style>