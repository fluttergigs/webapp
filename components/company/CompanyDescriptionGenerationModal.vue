<script lang="ts" setup>
  //@ts-ignore
  import type { Notification } from '#ui/types';
  import { storeToRefs } from 'pinia';
  import CustomInput from '~/components/forms/CustomInput.vue';
  import { logDev } from '~/core/helpers/log';
  import { BaseToast } from '~/core/ui/base_toast';
  import { companyDescriptionSchema } from '~/core/validations/company.validations';
  import { useCompanyStore } from '~/stores/company';

  const companyStore = useCompanyStore();
  const { companyDescriptionGenerationTask } = storeToRefs(companyStore);
  const description = ref('');
  const { $toast } = useNuxtApp();

  const canGenerate = ref(false);

  //@ts-ignore
  const emits = defineEmits(['onGenerate']);
  const generateText = async () => {
    try {
      await companyStore.generateCompanyDescription(description.value);
      emits('onGenerate', { result: companyDescriptionGenerationTask.value.value });
    } catch (e) {
      logDev('ERROR WHILE GENERATING COMPANY DESCRIPTION', e);
      //@ts-ignore
    } finally {
      ($toast as BaseToast<Notification, number>).info(
        companyStore.companyDescriptionGenerationTask.message,
      );
      companyStore.hideCompanyDescriptionGenerationModal();
    }
  };

  watch(
    description,
    async () => {
      canGenerate.value = await companyDescriptionSchema.isValid({
        description: description.value,
      });
    },
    { deep: true },
  );
</script>

<template>
  <UModal
    v-model:open="companyStore.isCompanyDescriptionGenerationModalOpen"
    title="Generate your company's description with AI 🚀"
  >
    <template #body>
      <!--        <template #header>
                <h3>Generate your company's description with AI 🚀</h3>
              </template>-->
      <CustomInput
        v-model="description"
        :is-text-area="true"
        name="description"
        placeholder="Generate a short and comprehensive description for a Fintech company"
      />
    </template>
    <template #footer>
      <UButton
        :disabled="!canGenerate || companyStore.companyDescriptionGenerationTask.isLoading"
        :loading="companyStore.companyDescriptionGenerationTask.isLoading"
        class="bg-indigo-700 text-white"
        color="indigo"
        label="Generate"
        size="lg"
        @click="generateText"
      />
    </template>
  </UModal>
</template>

<style scoped></style>
