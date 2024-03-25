<script setup lang="ts">

import {useJobStore} from "~/stores/job";
import CustomInput from "~/components/forms/CustomInput.vue";
import {logDev} from "~/core/helpers/log";
import {useCompanyStore} from "~/stores/company";
import {companyDescriptionSchema} from "~/core/validations/company.validations";
import {storeToRefs} from "pinia";

const companyStore = useCompanyStore()
const {companyDescriptionGenerationTask} = storeToRefs(companyStore)
const description = ref('')
const {$toast} = useNuxtApp()

const canGenerate = ref(false)

const emits = defineEmits(['onGenerate'])
const generateText = async () => {
  try {
    await companyStore.generateCompanyDescription(description.value)
    emits('onGenerate', {result: companyDescriptionGenerationTask.value.value})
  } catch (e) {
    logDev('ERROR WHILE GENERATING COMPANY DESCRIPTION', e)
    //@ts-ignore
  } finally {
    $toast.info(companyStore.companyDescriptionGenerationTask.message)
    companyStore.hideCompanyDescriptionGenerationModal()
  }
}

watch(description, async () => {
  canGenerate.value = await companyDescriptionSchema.isValid({description: description.value});
}, {deep: true},)
</script>

<template>
  <UModal v-model="companyStore.isCompanyDescriptionGenerationModalOpen">
    <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
      <template #header>
        <h3>Generate your company's description with AI 🚀</h3>
      </template>

      <CustomInput :is-text-area="true" v-model="description" name="description"
                   placeholder="Generate a short and comprehensive description for a Fintech company"/>

      <template #footer>
        <UButton class="bg-indigo-700 text-white"
                 :disabled="!canGenerate || companyStore.companyDescriptionGenerationTask.isLoading"
                 @click="generateText" :loading="companyStore.companyDescriptionGenerationTask.isLoading"
                 label="Generate" color="indigo"/>
      </template>
    </UCard>
  </UModal>
</template>

<style scoped>

</style>