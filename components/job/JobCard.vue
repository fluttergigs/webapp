<script setup lang="ts">

import ArrowBackIcon from "~/components/icons/ArrowBackIcon.vue";
import {extractCompanyFromJob, userFacingRemoteOptions, userFacingWorkType} from "~/features/jobs/transformers";
import {AppRoutes} from "~/core/routes";
import {userFacingCompanySize} from "~/features/companies/transformers";
import useJobActions from "~/composables/useJobActions";

import type {JobOffer} from "~/features/jobs/job.types";
import {RemoteOptions} from "~/features/jobs/job.types";
import WorkingPermits from "~/components/job/WorkingPermits.vue";
import SaveJobIconButton from "~/components/job/SaveJobIconButton.vue";
//@ts-ignore
import {XCircleIcon} from "@heroicons/vue/24/outline";

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
      <div class="absolute right-[5px] top-[-12px]" v-if="useJobActions().jobBelongsToCompany(company)">
        <UDropdown :items="jobActionItems" :popper="{ placement: 'bottom-start'}">
          <div class="flex justify-center items-center">
            <UIcon class="ml-5 text-2xl" name="i-heroicons-ellipsis-horizontal"/>
          </div>
        </UDropdown>
      </div>
      <div class="absolute right-[3.5px] bottom-[-20px]">
        <SaveJobIconButton :job="job" :company="company"/>
      </div>
      <div class="flex flex-col flex-grow space-y-1.5">
        <div class="flex justify-between w-full">
          <h3 class="text-lg font-semibold flex-grow">
            {{ job?.title }}
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
          <WorkingPermits :countries="jobWorkingPermits(data?.countries??[], job as JobOffer)"/>

          <span class="rounded-full text-xs px-3 py-0.5 border border-gray-500/30">
            {{ userFacingRemoteOptions(job?.remoteOptions as RemoteOptions) }}
          </span>

          <span>•</span>
          <span class="rounded-full text-xs px-3 py-0.5 border border-gray-500/30">
            {{ userFacingWorkType(job?.workType) }}
          </span>

          <span>•</span>

          <div
              class="inline-flex text-xs items-center space-x-2 rounded-full px-3 py-0.5 bg-indigo-700/10 text-indigo-700">
            <UIcon name="i-heroicons-currency-dollar"/>
            <span>{{ job?.salaryFrom }} - {{ job?.salaryTo }}/month</span>
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

  <USlideover v-model="isJobSidePanelOpen" :ui="{ overlay: {  background: 'bg-gray-200/60 dark:bg-gray-800/75'}}">
    <div class="relative p-4">
      <XCircleIcon @click="isJobSidePanelOpen = false"
                   class="text-blueGray-900 w-8 absolute right-4 top-2 cursor-pointer"/>

      <div class="p-4 flex-1 my-4">
        <JobDetailsCard :job="job"/>
      </div>
    </div>
  </USlideover>
</template>

<style scoped>

</style>