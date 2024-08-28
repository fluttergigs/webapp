<script setup lang="ts">

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
  <div style="width: fit-content"
       class="inline-flex text-xs items-center
                space-x-2 rounded-full px-3 py-0.5
                bg-indigo-700/10 text-indigo-700 font-medium">
    <UIcon name="i-heroicons-currency-dollar"/>
    <span>${{ props.job?.salaryFrom }} - {{ props.job?.salaryTo }}/month</span>
  </div>
</template>

<style scoped>

</style>