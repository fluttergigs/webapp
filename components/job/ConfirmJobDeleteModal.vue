<script setup lang="ts">

import BaseModal from "~/components/ui/BaseModal.vue";
import type {PropType} from "@vue/runtime-core";
import type {JobOffer} from "~/features/jobs/job.types";
import {useJobStore} from "~/stores/job";
import {useCompanyStore} from "~/stores/company";

const props = defineProps({
  job: {
    type: Object as PropType<JobOffer>,
    required: true,
  }
})

const postDeleteJob = async () => {
  await useCompanyStore().fetchMyJobs()
  useModal().close()
}

const jobStore = useJobStore()
</script>

<template>
  <BaseModal header-title="Confirm job delete">
    <template #body>
      <div class="text-md font-medium">Do you want to delete <b>{{ job.title }}</b> job offer ?</div>
    </template>

    <template #footer>
      <div class="flex space-x-2">
        <UButton
            @click="useModal().close()"
            label="No" color="white"/>

        <UButton :loading="jobStore.jobDelete.isLoading" @click="useJobActions().handleJobDelete(job, postDeleteJob)"
                 label="Yes" color="red"/>
      </div>
    </template>
  </BaseModal>
</template>

<style scoped>

</style>