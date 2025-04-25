<script lang="ts" setup>
  import UpdateExperienceForm from '~/components/profile/UpdateExperienceForm.vue';
  import { useProfile } from '~/composables/useProfile';

  const {
    canUpdateExperience,
    isUpdatingExperience,
    toggleUpdateExperienceModal,
    updateExperience,
    isUpdateExperienceModalVisible,
  } = useProfile();
</script>

<template>
  <UModal
    v-model:open="isUpdateExperienceModalVisible"
    :dismissible="false"
    size="lg"
    title="Add experience"
  >
    <template #body>
      <UpdateExperienceForm />
    </template>

    <template #footer>
      <div class="flex gap-2">
        <UButton
          class="flex gap-2 font-medium"
          color="neutral"
          icon="i-heroicons-trash-solid"
          label="Delete"
          size="xl"
          variant="outline"
          @click="toggleUpdateExperienceModal"
        />

        <UButton
          :disabled="!canUpdateExperience"
          :loading="isUpdatingExperience"
          class="flex gap-2 font-medium"
          color="primary"
          label="Update experience"
          size="xl"
          @click="updateExperience"
        />
      </div>
    </template>
  </UModal>
</template>

<style scoped></style>
