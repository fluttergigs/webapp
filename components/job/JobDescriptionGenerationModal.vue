<script lang="ts" setup>
  import CustomInput from '~/components/forms/CustomInput.vue';
  import { logDev } from '~/core/helpers/log';
  import type { BaseToast } from '~/core/ui/base_toast';
  import { jobDescriptionSchema } from '~/core/validations/job.validations';
  import { useJobStore } from '~/stores/job';

  const jobStore = useJobStore();
  const description = ref('');
  const { $toast } = useNuxtApp();
  //@ts-ignore
  const emits = defineEmits(['successfulGeneration']);

  const canGenerate = ref(false);
  const generateText = async () => {
    try {
      await jobStore.generateJobDescription(description.value);
      emits('successfulGeneration', jobStore.jobDescriptionGenerationTask.value);
    } catch (e) {
      logDev('ERROR WHILE GENERATING DESCRIPTION', e);
      //@ts-ignore
    } finally {
      jobStore.hideJobDescriptionGenerationModal();
      ($toast as BaseToast<Notification, number>).info(
        jobStore.jobDescriptionGenerationTask.message,
      );
    }
  };

  watch(
    description,
    async () => {
      canGenerate.value = await jobDescriptionSchema.isValid({ description: description.value });
    },
    { deep: true },
  );
</script>

<template>
  <UModal v-model="jobStore.isJobDescriptionGenerationModalOpen">
    <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
      <template #header>
        <h3>Generate your job's description with AI 🚀</h3>
      </template>

      <CustomInput
        v-model="description"
        :is-text-area="true"
        name="description"
        placeholder="Generate a job description for Flutter Software Engineer position"
      />

      <template #footer>
        <UButton
          :disabled="!canGenerate || jobStore.jobDescriptionGenerationTask.isLoading"
          :loading="jobStore.jobDescriptionGenerationTask.isLoading"
          class="bg-indigo-700 text-white"
          color="indigo"
          label="Generate"
          @click="generateText"
        />
      </template>
    </UCard>
  </UModal>
</template>

<style scoped></style>
