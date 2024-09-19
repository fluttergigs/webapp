<script setup lang="ts">
import type {JobCreationRequest} from "~/features/jobs/job.types";
import {userFacingWorkType} from "~/features/jobs/transformers";
//@ts-ignore
import type {PropType} from "@vue/runtime-core";
import type {Country} from "~/core/shared/types";
import {useJobStore} from "~/stores/job";
import useCompanyActions from "~/composables/useCompanyActions";
import {AppRoutes} from "~/core/routes";
import WorkingPermits from "~/components/job/WorkingPermits.vue";
import {useUserStore} from "~/stores/user";
import type {Company} from "~/features/companies/company.types";

//@ts-ignore
const props = defineProps({
  job: {
    type: Object as PropType<JobCreationRequest>,
  },
  workPermitCountries: {
    type: Object as PropType<Country[]>
  },
  isCtaEnabled: {
    type: Boolean,
    default: false,
  },
  isCtaVisible: {
    type: Boolean,
    default: true,
  }
})

const {payForJobPosting} = useCompanyActions()
/*const userFacingWorkPermits = computed(() => {
  const countries = props.workPermitCountries.map((country: Country) => country)

  return `${countries[0].name} ${countries.length > 1 ? `+ ${countries.length - 1} more` : ''}`
})*/
</script>

<template>
  <div class="flex flex-col space-y-4 w-full sticky top-[88px]">
    <div
        class="transition-all ease-in-2s
        flex flex-col
        rounded-lg shadow-sm hover:shadow-md border border-indigo-700
        px-8 py-4 space-y-2 ">
      <div class="flex space-x-2 items-start justify-between">
        <CompanyLogo size="2xl" :company="useUserStore().myCompany as Company"/>

        <WorkingPermits :countries="workPermitCountries??[]"/>
      </div>
      <p class="text-lg text-gray-900 font-medium">{{ job?.title }}</p>

      <p class="font-medium text-gray-700">{{ useUserStore()?.myCompany?.name }}</p>

      <div class="inline-flex items-center space-x-1 text-md font-normal">
        <UIcon name="i-heroicons-currency-dollar"/>
        <span>{{ job?.salaryFrom ?? 0 }} - {{ job?.salaryTo ?? 0 }}/month</span>
      </div>

      <div class="rounded-lg border px-2 py-1 text-xs my-4 !w-fit" style="width: fit-content">
        {{ userFacingWorkType(job?.workType) }}
      </div>
    </div>

    <UButton v-if="isCtaVisible" @click="()=>payForJobPosting(()=> navigateTo(AppRoutes.myJobs))"
             :loading="useJobStore().jobCreation.isLoading"
             :disabled="!isCtaEnabled" size="xl" color="indigo"
             class="bg-indigo-700 flex justify-center items-center"
             label="Post job for $20"/>
  </div>
</template>

<style scoped>

</style>