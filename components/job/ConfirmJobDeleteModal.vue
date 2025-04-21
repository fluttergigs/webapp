<script lang="ts" setup>
  //@ts-ignore
  import type { PropType } from '@vue/runtime-core';
  import BaseModal from '~/components/ui/BaseModal.vue';
  import type { JobOffer } from '~/features/jobs/job.types';
  import { useCompanyStore } from '~/stores/company';
  import { useJobStore } from '~/stores/job';

  //@ts-ignore
  const props = defineProps({
    job: {
      type: Object as PropType<JobOffer>,
      required: true,
    },
  });

  const postDeleteJob = async () => {
    await useCompanyStore().fetchMyJobs();
    useModal().close();
  };

  const jobStore = useJobStore();
</script>

<template>
  <BaseModal header-title="Confirm job delete">
    <template #body>
      <div class="text-md font-medium">
        Do you want to delete <b>{{ job.title }}</b> job offer ?
      </div>
    </template>

    <template #footer>
      <div class="flex space-x-2">
        <UButton color="white" label="No" @click="useModal().close()" />

        <UButton
          :loading="jobStore.jobDelete.isLoading"
          color="red"
          label="Yes"
          @click="useJobActions().handleJobDelete(job, postDeleteJob)"
        />
      </div>
    </template>
  </BaseModal>
</template>

<style scoped></style>
