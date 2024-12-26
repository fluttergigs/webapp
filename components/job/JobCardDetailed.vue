<script lang="ts" setup>
import type { JobOffer } from "~/features/jobs/job.types";
import { RemoteOptions } from "~/features/jobs/job.types";
import {
  extractCompanyFromJob,
  userFacingRemoteOptions,
  userFacingWorkType,
} from "~/features/jobs/transformers";
import WorkingPermits from "~/components/job/WorkingPermits.vue";
import useJobActions from "~/composables/useJobActions";
import JobSalaryBox from "~/components/job/JobSalaryBox.vue";

//@ts-ignore
const props = defineProps({
  job: {
    type: Object as PropType<JobOffer>,
  },
});

const { data, error } = await useCountries();
const { jobWorkingPermits } = useJobActions();

const isJobSidePanelOpen = ref(false);

const company = computed(() => ({
  ...extractCompanyFromJob(props.job),
}));
</script>

<template>
  <div
    class="w-full cursor-pointer sm:w-1/2 xl:w-1/3 2xl:w-1/4"
    @click="useJobActions().viewDetails(job!)"
  >
    <div class="group">
      <div
        class="h-full rounded-xl border bg-white bg-opacity-80 p-8 transition-all duration-200 ease-in group-hover:border-gray-300 group-hover:shadow-xl"
      >
        <div class="flex h-full flex-col justify-between">
          <div class="mb-16 flex flex-col gap-1">
            <h3
              class="text-md mb-4 line-clamp-1 font-heading font-bold leading-snug sm:line-clamp-2 sm:text-xl"
            >
              {{ job.title }}
            </h3>
            <p
              class="line-clamp-3 overflow-ellipsis text-[12px] font-medium leading-relaxed text-gray-500 sm:line-clamp-2 sm:text-sm"
            >
              {{ job.description }}
            </p>

            <JobSalaryBox :job="job" />
          </div>

          <div class="flex flex-grow flex-wrap items-center gap-1.5 text-sm">
            <WorkingPermits
              :countries="jobWorkingPermits(data?.countries??[], job as JobOffer)"
            />

            <span
              class="rounded-full border border-gray-500/30 px-3 py-0.5 text-xs"
            >
              {{ userFacingRemoteOptions(job?.remoteOptions as RemoteOptions) }}
            </span>

            <span
              class="rounded-full border border-gray-500/30 px-3 py-0.5 text-xs"
            >
              {{ userFacingWorkType(job?.workType) }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
