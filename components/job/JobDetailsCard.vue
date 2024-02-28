<script setup>

import ItemData from "~/components/job/ItemData.vue";
import {userFacingRemoteOptions, userFacingSeniorityLevel, userFacingWorkType} from "~/features/jobs/transformers";

const props = defineProps({
      job: {
        type: Object,
        required: true,
      }
    }
)
</script>

<template>
  <div class="p-6 border rounded-xl space-y-5 flex flex-col">

    <h3 class="text-xl font-semibold">About the job</h3>

    <ItemData label="Apply Before">
      <template #content>
        <p class="text-md font-medium" v-date-format="{date:props.job.applyBefore, format:'MMM YYYY, D'}"></p>
      </template>
    </ItemData>
    <ItemData label="Posted on">
      <template #content>
        <p class="text-md font-medium" v-date-format="{date:props.job.createdAt, format:'MMM YYYY, D'}"></p>
      </template>
    </ItemData>
    <ItemData :value="userFacingWorkType(props.job.workType)" label="Job type"/>
    <ItemData :value="userFacingSeniorityLevel(props.job.seniorityLevel)" label="Experience Level"/>
    <ItemData :value="userFacingRemoteOptions(props.job.remoteOptions)" label="Remote options"/>
    <ItemData label="Salary range">
      <template #content>
        <div class="inline-flex items-center space-x-2 font-medium text-md">
          <UIcon name="i-heroicons-currency-dollar"/>
          <span>{{ props.job.salaryFrom }} - {{ props.job.salaryTo }}</span>
        </div>
      </template>
    </ItemData>
  </div>
</template>

<style scoped>

</style>