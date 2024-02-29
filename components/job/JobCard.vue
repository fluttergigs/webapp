<script setup>

import ArrowBackIcon from "~/components/icons/ArrowBackIcon.vue";
import {extractCompanyFromJob, userFacingRemoteOptions, userFacingWorkType} from "~/features/jobs/transformers";
import {AppRoutes} from "~/core/routes";
import {useJobStore} from "~/stores/job";
import {userFacingCompanySize} from "~/features/companies/transformers";
import {useAuthStore} from "~/stores/auth";

const props = defineProps({
  job: Object,
})

const isMyJob = computed(() => {
  return (company.value?.id === useAuthStore().myCompany.id) ?? false
})

const viewDetails = () => {
  useJobStore().findJobById(props.job)
  navigateTo(AppRoutes.jobDetail(props.job.slug))
}

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
  <UCard
      :class="['transition-all duration-300 ease-in-out cursor-pointer', isMyJob?'':'hover:translate-x-1.5 ']">
    <div class="flex justify-between items-center relative">
      <div class="absolute right-[7px] top-0" v-if="isMyJob">
        <UDropdown :items="jobActionItems" :popper="{ placement: 'bottom-start'}">
          <div class="flex justify-center items-center">
            <UIcon class="ml-5 text-2xl" name="i-heroicons-ellipsis-horizontal"/>
          </div>
        </UDropdown>
      </div>
      <div class="flex flex-col flex-grow space-y-2">
        <div class="flex justify-between w-full">
          <h3 class="text-xl font-semibold flex-grow">
            {{ props.job?.title }}
          </h3>
        </div>
        <div class="flex space-x-3 text-sm">
          <h4 class="text-md text-gray-900 font-medium">{{ company?.name }}</h4>

          <div class="flex items-center space-x-1">
            <UIcon class="text-gray-600" name="i-heroicons-user-group"/>
            <span class="text-black font-medium">
              {{ userFacingCompanySize(company?.size) }}
            </span>
          </div>
        </div>

        <!--        options-->
        <div class="space-x-3 text-sm">
          <span class="rounded-full px-4 py-0.5 border border-gray-500/30">
            {{ userFacingRemoteOptions(props.job?.remoteOptions) }}
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
            class="w-9 h-9 self-end flex
            justify-self-end
            items-center justify-center
            rounded-full bg-indigo-600
            cursor-pointer"
            @click="viewDetails">
          <ArrowBackIcon class="h-3 rotate-180 shadow-lg text-white"/>
        </div>
      </div>
    </div>
  </UCard>

</template>

<style scoped>

</style>