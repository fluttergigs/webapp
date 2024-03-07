<script setup lang="ts">
import type {JobCreationRequest} from "~/features/jobs/job.types";
import {userFacingWorkType} from "~/features/jobs/transformers";
import {useAuthStore} from "~/stores/auth";

//@ts-ignore
const props = defineProps({
  job: {
    type: Object as PropType<JobCreationRequest>,
  }
})
</script>

<template>
  <div class="flex flex-col space-y-4 w-full">
    <div
        class="transition-all ease-in-2s
        flex flex-col
        rounded-lg shadow-sm hover:shadow-md border border-indigo-700
        px-8 py-4 space-y-2 ">
      <div class="flex space-x-2">
        <UiAvatar/>
      </div>
      <p class="text-lg text-gray-900 font-medium">{{ job?.title }}</p>

      <p class="font-medium text-gray-700">{{ useAuthStore()?.myCompany?.name }}</p>

      <div class="inline-flex items-center space-x-1 text-md font-normal">
        <UIcon name="i-heroicons-currency-dollar"/>
        <span>{{ job?.salaryFrom ?? 0 }} - {{ job?.salaryTo ?? 0 }}/month</span>
      </div>

      <div class="rounded-lg border px-2 py-1 text-xs my-4 !w-fit" style="width: fit-content">
        {{ userFacingWorkType(job?.workType) }}
      </div>
    </div>

    <UButton size="xl" color="indigo"
             class="bg-indigo-700 flex justify-center items-center"
             label="Post job for $20"/>
  </div>
</template>

<style scoped>

</style>