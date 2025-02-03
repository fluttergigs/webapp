<script lang="ts" setup>

import type {JobOffer} from "~/features/jobs/job.types";
import type {PropType} from "@vue/runtime-core";

const props = defineProps({
  job: {
    type: Object as PropType<JobOffer>,
    required: true
  }
})
</script>

<template>
  <div class="inline-flex text-[12px] items-center
                space-x-2 rounded-full px-3 py-1.5
                bg-indigo-700/10 text-indigo-700 font-medium"
       style="width: fit-content">
    <UIcon name="i-heroicons-currency-dollar"/>
    <span v-if="props.job.salaryFrom">${{ props.job?.salaryFrom }} - {{ props.job?.salaryTo }}/month</span>
    <span v-else> N/A</span>
  </div>
</template>

<style scoped>

</style>