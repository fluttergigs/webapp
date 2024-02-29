<script setup>
import {useJobStore} from "~/stores/job";
import {storeToRefs} from "pinia";
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
      <template v-if="props.jobsResponse.isSuccess">

        <template v-if="props.jobs.length > 0">
          <slot v-for="job in props.jobs" :job="job" :key="job.slug">
            <JobCard :job="job" :key="job.slug"/>
          </slot>
        </template>

        <div class="flex items-center justify-center" v-else>
          <slot name="noData">
            <img class="w-96 h-96" alt="Empty job results" src="@/assets/images/emptyJobFiltersResult.svg"/>
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
    </client-only>
  </div>
</template>

<style scoped>

</style>