<script setup>

// import {JobOffer} from "@/features/jobs/job.types";
// import type {PropType} from "@vue/runtime-core";

import ArrowBackIcon from "~/components/icons/ArrowBackIcon.vue";

const props = defineProps({
  job: Object,
})

const viewDetails = () => {

}

const company = computed(() => ({
  ...props.job.company.data['attributes'],
  id: props.job.company.data['id']
}))

</script>

<template>
  <UCard class="hover:translate-x-1.5 transition-all duration-300 ease-in-out">
    <div class="flex justify-between items-center">
      <div class="flex flex-col flex-grow space-y-3">

        <h3 class="text-lg font-semibold">{{ props.job.title }} <span class="text-md text-gray-600">at {{company.name}}</span></h3>
        <div class="space-x-4 text-sm font-medium">
          <span class="rounded-full px-4 py-0.5 border border-gray-500/30">
            {{ props.job.remoteOptions }}
          </span>

          <span>•</span>
          <span class="rounded-full px-4 py-0.5 border border-gray-500/30">
            {{ props.job.workType }}
          </span>

          <span>•</span>

          <div class="inline-flex items-center space-x-2 rounded-full px-4 py-0.5 bg-indigo-700/10 text-indigo-700">
            <UIcon name="i-heroicons-currency-dollar"/>
            <span>{{ props.job.salaryFrom }} - {{ props.job.salaryTo }}</span>
          </div>

        </div>
      </div>

      <div class="flex flex-col justify-between">
        <div class="w-10 h-10 flex items-center justify-center rounded-full bg-indigo-600 cursor-pointer"
             @click="viewDetails">
          <ArrowBackIcon class="rotate-180 shadow-lg text-white"/>
        </div>
      </div>

    </div>

  </UCard>

</template>

<style scoped>

</style>