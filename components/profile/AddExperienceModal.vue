<script setup lang="ts">
  import AddExperienceForm from '~/components/profile/AddExperienceForm.vue';
  import { useProfile } from '~/composables/useProfile';

  const {
    canAddExperience,
    isAddingExperience,
    isAddExperienceModalVisible,
    toggleAddExperienceModal,
    addExperience,
  } = useProfile();
</script>

<template>
  <UModal
    v-model:open="isAddExperienceModalVisible"
    :dismissible="false"
    size="lg"
    title="Add experience"
  >
    <template #body>
      <AddExperienceForm />
    </template>

    <template #footer>
      <div class="flex gap-2">
        <UButton
          class="flex gap-2 font-medium"
          color="neutral"
          label="Cancel"
          size="xl"
          variant="outline"
          @click="toggleAddExperienceModal"
        />

        <UButton
          :disabled="!canAddExperience"
          :loading="isAddingExperience"
          class="flex gap-2 font-medium"
          color="primary"
          label="Add experience"
          size="xl"
          @click="addExperience"
        />
      </div>
    </template>
  </UModal>
</template>

<style scoped></style>
