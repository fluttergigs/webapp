<script setup lang="ts">

import {useJobStore} from "~/stores/job";
import CustomInput from "~/components/forms/CustomInput.vue";
import {logDev} from "~/core/helpers/log";
import {jobDescriptionSchema} from "~/core/validations/job.validations";
import type {BaseToast} from "~/core/ui/base_toast";

const jobStore = useJobStore()
const description = ref('')
const {$toast} = useNuxtApp()
//@ts-ignore
const emits = defineEmits(['successfulGeneration'])

const canGenerate = ref(false)
const generateText = async () => {
  try {
    await jobStore.generateJobDescription(description.value)
    emits('successfulGeneration', jobStore.jobDescriptionGenerationTask.value)

  } catch (e) {
    logDev('ERROR WHILE GENERATING DESCRIPTION', e)
    //@ts-ignore
  } finally {
    jobStore.hideJobDescriptionGenerationModal();
    ($toast as BaseToast<Notification>).info(jobStore.jobDescriptionGenerationTask.message)
  }

}

watch(description, async () => {
  canGenerate.value = await jobDescriptionSchema.isValid({description: description.value});
}, {deep: true},)
</script>

<template>
  <UModal v-model="jobStore.isJobDescriptionGenerationModalOpen">
    <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
      <template #header>
        <h3>Generate your job's description with AI 🚀</h3>
      </template>

      <CustomInput :is-text-area="true"
                   v-model="description"
                   name="description"
                   placeholder="Generate a job description for Flutter Software Engineer position"/>

      <template #footer>
        <UButton class="bg-indigo-700 text-white"
                 :disabled="!canGenerate || jobStore.jobDescriptionGenerationTask.isLoading"
                 @click="generateText" :loading="jobStore.jobDescriptionGenerationTask.isLoading"
                 label="Generate" color="indigo"/>
      </template>
    </UCard>
  </UModal>
</template>

<style scoped>

</style>