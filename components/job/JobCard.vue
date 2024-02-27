<script setup>

// import {JobOffer} from "@/features/jobs/job.types";
// import type {PropType} from "@vue/runtime-core";

import ArrowBackIcon from "~/components/icons/ArrowBackIcon.vue";
import {extractCompanyFromJob, userFacingRemoteOptions, userFacingWorkType} from "~/features/jobs/transformers";
import {AppRoutes} from "~/core/routes";
import {useJobStore} from "~/stores/job";
import {userFacingCompanySize} from "~/features/companies/transformers";

const props = defineProps({
  job: Object,
})

const viewDetails = () => {
  useJobStore().findJobById(props.job)
  navigateTo(AppRoutes.jobDetail(props.job.slug))
}

const company = computed(() => ({
  ...extractCompanyFromJob(props.job)
}))

</script>

<template>
  <UCard class="hover:translate-x-1.5 transition-all duration-300 ease-in-out cursor-pointer">
    <div class="flex justify-between items-center">
      <div class="flex flex-col flex-grow space-y-3">
        <h3 class="text-xl font-semibold">{{ props.job.title }}
        </h3>
        <div class="flex space-x-3">
          <h4 class="text-md text-gray-900 font-medium">{{ company.name }}</h4>

          <div class="flex items-center space-x-1">
            <UIcon class="text-gray-600" name="i-heroicons-user-group"/>
            <span class="text-black font-medium">
              {{ userFacingCompanySize(company.size) }}
            </span>
          </div>
        </div>
        <div class="space-x-4 text-sm font-medium">
          <span class="rounded-full px-4 py-0.5 border border-gray-500/30">
            {{ userFacingRemoteOptions(props.job.remoteOptions) }}
          </span>

          <span>•</span>
          <span class="rounded-full px-4 py-0.5 border border-gray-500/30">
            {{ userFacingWorkType(props.job.workType) }}
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