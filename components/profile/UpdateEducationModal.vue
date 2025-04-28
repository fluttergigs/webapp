<script lang="ts" setup>
  import UpdateEducationForm from '~/components/profile/UpdateEducationForm.vue';
  import ConfirmationFooter from '~/components/ui/molecules/ConfirmationFooter.vue';
  import { useProfile } from '~/composables/useProfile';

  const {
    canUpdateEducation,
    isUpdatingEducation,
    updateEducationModal,
    updateEducation,
    educationDeleteMode,
    deleteEducation,
    isDeletingEducation,
  } = useProfile();

  const handleDeleteButtonClick = () => {
    educationDeleteMode.toggle();
    deleteEducation();
  };
</script>

<template>
  <UModal
    v-model:open="updateEducationModal.isVisible.value"
    :dismissible="false"
    size="lg"
    title="Update Education"
  >
    <template #body>
      <UpdateEducationForm />
    </template>

    <template #footer>
      <ConfirmationFooter
        v-if="educationDeleteMode.isEnabled.value"
        :loading="isDeletingEducation"
        @cancel="educationDeleteMode.toggle"
        @confirm="handleDeleteButtonClick"
      />
      <div v-else class="flex justify-between w-full">
        <UButton
          class="flex gap-2 font-medium"
          color="neutral"
          label="Delete education"
          size="xl"
          variant="ghost"
          @click="educationDeleteMode.enable(updateEducationModal.selectedItem.value!)"
        />
        <div class="flex gap-2">
          <UButton
            class="flex gap-2 font-medium"
            color="neutral"
            label="Cancel"
            size="xl"
            variant="outline"
            @click="updateEducationModal.toggle"
          />

          <UButton
            :disabled="!canUpdateEducation"
            :loading="isUpdatingEducation"
            class="flex gap-2 font-medium"
            color="primary"
            label="Update education"
            size="xl"
            @click="updateEducation"
          />
        </div>
      </div>
    </template>
  </UModal>
</template>

<style scoped></style>
