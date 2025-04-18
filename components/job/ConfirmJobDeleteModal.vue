<script lang="ts" setup>

  import BaseModal from '~/components/ui/BaseModal.vue';
  //@ts-ignore
  import type { PropType } from '@vue/runtime-core';
  import type { JobOffer } from '~/features/jobs/job.types';
  import { useJobStore } from '~/stores/job';
  import { useCompanyStore } from '~/stores/company';

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
      <div class="text-md font-medium">Do you want to delete <b>{{ job.title }}</b> job offer ?</div>
    </template>

    <template #footer>
      <div class="flex space-x-2">
        <UButton
          color="white"
          label="No" @click="useModal().close()" />

        <UButton :loading="jobStore.jobDelete.isLoading" color="red"
                 label="Yes" @click="useJobActions().handleJobDelete(job, postDeleteJob)" />
      </div>
    </template>
  </BaseModal>
</template>

<style scoped>

</style>