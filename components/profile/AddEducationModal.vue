<script lang="ts" setup>
  import AddEducationForm from '~/components/profile/AddEducationForm.vue';
  import { useProfile } from '~/composables/useProfile';

  const {
    canAddEducation,
    isAddingEducation,
    addEducationModal,
    addEducation,
    resetEducationForm,
  } = useProfile();

  const handleCancelButtonClick = () => {
    resetEducationForm();
    addEducationModal.toggle();
  };
</script>

<template>
  <UModal
    v-model:open="addEducationModal.isVisible.value"
    :dismissible="false"
    size="lg"
    title="Add Education"
  >
    <template #body>
      <AddEducationForm />
    </template>

    <template #footer>
      <div class="flex gap-2">
        <UButton
          class="flex gap-2 font-medium"
          color="neutral"
          label="Cancel"
          size="xl"
          variant="outline"
          @click="handleCancelButtonClick"
        />

        <UButton
          :disabled="!canAddEducation"
          :loading="isAddingEducation"
          class="flex gap-2 font-medium"
          color="primary"
          label="Add Education"
          size="xl"
          @click="addEducation"
        />
      </div>
    </template>
  </UModal>
</template>

<style scoped></style>
