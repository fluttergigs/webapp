<script setup lang="ts">

import ArrowBackIcon from "~/components/icons/ArrowBackIcon.vue";
import {extractCompanyFromJob, userFacingRemoteOptions, userFacingWorkType} from "~/features/jobs/transformers";
import {AppRoutes} from "~/core/routes";
import {userFacingCompanySize} from "~/features/companies/transformers";
import useJobActions from "~/composables/useJobActions";
//@ts-ignore
import type {PropType} from "@vue/runtime-core";
import type {JobOffer} from "~/features/jobs/job.types";
import {RemoteOptions} from "~/features/jobs/job.types";
import WorkingPermits from "~/components/job/WorkingPermits.vue";
import SaveJobIconButton from "~/components/job/SaveJobIconButton.vue";

const {data, error} = await useCountries();
const {jobWorkingPermits} = useJobActions();

//@ts-ignore
const props = defineProps({
  job: {
    type: Object as PropType<JobOffer>,
  }
})

const isJobSidePanelOpen = ref(false)

const company = computed(() => ({
  ...extractCompanyFromJob(props.job)
}))

const jobActionItems = [
  [{
    label: 'Edit',
    click: () => {
      //TODO - implement job edition
    }
  }],
  [{
    label: 'Duplicate',
    click: () => {
      //TODO - implement job duplicate
    }
  }],
  [{
    label: 'View',
    click: () => {
      navigateTo(AppRoutes.jobDetail(props.job.slug))
    }
  }],
  [{
    label: 'Delete',
    click: () => {
      //TODO- implement job delete
    }
  },],
]

</script>

<template>
  <UCard @click="useJobActions().viewDetails(job!)"
         :class="['transition-all duration-300 ease-in-out cursor-pointer',
      useJobActions().jobBelongsToCompany(company)?'':'hover:translate-x-1.5 ']">
    <div class="flex justify-between items-center relative">
      <div class="absolute right-[7px] top-[-12px]" v-if="useJobActions().jobBelongsToCompany(company)">
        <UDropdown :items="jobActionItems" :popper="{ placement: 'bottom-start'}">
          <div class="flex justify-center items-center">
            <UIcon class="ml-5 text-2xl" name="i-heroicons-ellipsis-horizontal"/>
          </div>
        </UDropdown>
      </div>
      <div class="absolute right-[3.5px] bottom-[-20px]" >
       <SaveJobIconButton :job="props.job" :company="company"/>
      </div>
      <div class="flex flex-col flex-grow space-y-1.5">
        <div class="flex justify-between w-full">
          <h3 class="text-lg font-semibold flex-grow">
            {{ props.job?.title }}
          </h3>
        </div>
        <div class="flex space-x-3 text-sm">
          <h4 class="text-sm text-gray-900 font-medium">{{ company?.name }}</h4>

          <div class="flex items-center space-x-1">
            <UIcon class="text-gray-600" name="i-heroicons-user-group"/>
            <span class="text-black font-medium">
              {{ userFacingCompanySize(company?.size) }}
            </span>
          </div>
        </div>

        <!--        options-->
        <div class="flex space-x-3 text-sm items-center">
          <WorkingPermits :countries="jobWorkingPermits(data?.countries??[], props.job as JobOffer)"/>

          <span class="rounded-full px-4 py-0.5 border border-gray-500/30">
            {{ userFacingRemoteOptions(props.job?.remoteOptions as RemoteOptions) }}
          </span>

          <span>•</span>
          <span class="rounded-full px-4 py-0.5 border border-gray-500/30">
            {{ userFacingWorkType(props.job?.workType) }}
          </span>

          <span>•</span>

          <div class="inline-flex items-center space-x-2 rounded-full px-4 py-0.5 bg-indigo-700/10 text-indigo-700">
            <UIcon name="i-heroicons-currency-dollar"/>
            <span>{{ props.job?.salaryFrom }} - {{ props.job?.salaryTo }}/month</span>
          </div>
        </div>
      </div>
      <div class="flex flex-col">
        <div
            class="w-8 h-8 self-end flex
            justify-self-end
            items-center justify-center
            rounded-full bg-indigo-600
            cursor-pointer"
            @click.capture.stop="isJobSidePanelOpen = true">
          <ArrowBackIcon class="h-3 rotate-180 shadow-lg text-white"/>
        </div>
      </div>
    </div>
  </UCard>

  <USlideover v-model="isJobSidePanelOpen" :ui="{ overlay: {  background: 'bg-gray-200/60 dark:bg-gray-800/75',}}">
    <div class="p-4 flex-1">
      <JobDetailsCard :job="job"/>
    </div>
  </USlideover>
</template>

<style scoped>

</style>