<script lang="ts" setup>
  import UpdateEducationForm from '~/components/profile/UpdateEducationForm.vue';
  import { useProfile } from '~/composables/useProfile';

  const {
    canUpdateEducation,
    isUpdatingEducation,
    toggleUpdateEducationModal,
    updateEducation,
    isUpdateEducationModalVisible,
  } = useProfile();
</script>

<template>
  <UModal
    v-model:open="isUpdateEducationModalVisible"
    :dismissible="false"
    size="lg"
    title="Update Education"
  >
    <template #body>
      <UpdateEducationForm />
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
          @click="toggleUpdateEducationModal"
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
    </template>
  </UModal>
</template>

<style scoped></style>
