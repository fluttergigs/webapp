<script lang="ts" setup>
  import AddEducationForm from '~/components/profile/AddEducationForm.vue';
  import { useProfile } from '~/composables/useProfile';

  const {
    canAddEducation,
    isAddingEducation,
    isAddEducationModalVisible,
    toggleAddEducationModal,
    addEducation,
  } = useProfile();
</script>

<template>
  <UModal
    v-model:open="isAddEducationModalVisible"
    :dismissible="false"
    size="lg"
    title="Add education"
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
          @click="toggleAddEducationModal"
        />

        <UButton
          :disabled="!canAddEducation"
          :loading="isAddingEducation"
          class="flex gap-2 font-medium"
          color="primary"
          label="Add education"
          size="xl"
          @click="addEducation"
        />
      </div>
    </template>
  </UModal>
</template>

<style scoped></style>
