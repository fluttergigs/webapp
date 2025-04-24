<script lang="ts" setup>
  import AddEducationForm from '~/components/profile/AddEducationForm.vue';
  import EducationCard from '~/components/profile/EducationCard.vue';
  import EmptyEducationCard from '~/components/profile/EmptyEducationCard.vue';
  import { useProfile } from '~/composables/useProfile';

  const {
    hasEducations,
    canAddEducation,
    isAddingEducation,
    isAddEducationModalVisible,
    toggleAddEducationModal,
    addEducation,
    educations,
  } = useProfile();
</script>

<template>
  <div class="flex flex-col gap-4 my-12 mr-8 w-full">
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

    <div v-if="hasEducations" class="flex flex-row md:flex-col py-2">
      <div
        class="flex flex-col border-b border-gray-200 md:flex-row justify-start md:justify-between w-full"
      >
        <div class="flex flex-col gap-2 py-2">
          <h3 class="text-3xl font-semibold text-gray-900">Education</h3>
          <p>Add your educational background</p>
        </div>

        <UButton
          class="font-medium h-fit"
          color="primary"
          icon="i-heroicons-plus-circle-solid"
          label="Add Education"
          size="xl"
          @click="toggleAddEducationModal"
        />
      </div>

      <div class="flex flex-col gap-4 mt-4">
        <EducationCard v-for="education in educations" :key="education.id" :education="education" />
      </div>
    </div>

    <EmptyEducationCard v-else />
  </div>
</template>

<style scoped></style>
