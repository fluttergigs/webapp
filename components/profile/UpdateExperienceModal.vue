<script lang="ts" setup>
  import UpdateExperienceForm from '~/components/profile/UpdateExperienceForm.vue';
  import ConfirmationFooter from '~/components/ui/molecules/ConfirmationFooter.vue';
  import { useProfile } from '~/composables/useProfile';

  const {
    canUpdateExperience,
    isUpdatingExperience,
    updateExperience,
    updateExperienceModal,
    experienceDeleteMode,
    deleteExperience,
    isDeletingExperience,
  } = useProfile();

  const handleDeleteButtonClick = () => {
    deleteExperience();
    experienceDeleteMode.toggle();
  };
</script>

<template>
  <UModal
    v-model:open="updateExperienceModal.isVisible.value"
    :dismissible="false"
    size="lg"
    title="Update Experience"
  >
    <template #body>
      <UpdateExperienceForm />
    </template>

    <template #footer>
      <ConfirmationFooter
        v-if="experienceDeleteMode.isEnabled.value"
        :loading="isDeletingExperience"
        @cancel="experienceDeleteMode.toggle"
        @confirm="handleDeleteButtonClick"
      />

      <div v-else class="flex w-full justify-between">
        <UButton
          class="flex gap-2 font-medium"
          color="neutral"
          label="Delete"
          size="xl"
          variant="ghost"
          @click="() => experienceDeleteMode.enable(updateExperienceModal.selectedItem.value!)"
        />
        <div class="flex gap-2">
          <UButton
            class="flex gap-2 font-medium"
            color="neutral"
            label="Cancel"
            size="xl"
            variant="outline"
            @click="updateExperienceModal.toggle"
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
      </div>
    </template>
  </UModal>
</template>

<style scoped></style>
