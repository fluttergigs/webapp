<script setup lang="ts">

import type {JobOffer} from "~/features/jobs/job.types";
import {RemoteOptions} from "~/features/jobs/job.types";
import {extractCompanyFromJob, userFacingRemoteOptions, userFacingWorkType} from "~/features/jobs/transformers";
import WorkingPermits from "~/components/job/WorkingPermits.vue";
import useJobActions from "~/composables/useJobActions";
import JobSalaryBox from "~/components/job/JobSalaryBox.vue";

//@ts-ignore
const props = defineProps({
  job: {
    type: Object as PropType<JobOffer>,
  }
})

const {data, error} = await useCountries();
const {jobWorkingPermits} = useJobActions();

const isJobSidePanelOpen = ref(false)

const company = computed(() => ({
  ...extractCompanyFromJob(props.job)
}))
</script>

<template>
  <div class="w-full sm:w-1/2 xl:w-1/3 2xl:w-1/4 p-2 cursor-pointer" @click="useJobActions().viewDetails(job!)">
    <div class="group">
      <div
          class="p-8 h-full bg-white bg-opacity-80 border
          group-hover:border-gray-300 group-hover:shadow-xl rounded-xl
          transition-all ease-in duration-200">
        <div class="flex flex-col justify-between h-full">
          <div class="mb-16 flex flex-col space-y-2">
            <h3 class="mb-4 text-xl font-bold font-heading leading-snug">
              {{ job.title }}
            </h3>
            <p class="text-gray-500 font-medium leading-relaxed line-clamp-2 overflow-ellipsis">
              {{ job.description }}
            </p>

            <JobSalaryBox :job="job"/>
          </div>

          <div class="flex flex-grow space-x-3 text-sm items-center">
            <WorkingPermits :countries="jobWorkingPermits(data?.countries??[], job as JobOffer)"/>

            <span class="rounded-full text-xs px-3 py-0.5 border border-gray-500/30">
            {{ userFacingRemoteOptions(job?.remoteOptions as RemoteOptions) }}
          </span>

            <span>•</span>
            <span class="rounded-full text-xs px-3 py-0.5 border border-gray-500/30">
            {{ userFacingWorkType(job?.workType) }}
          </span>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<style scoped>

</style>