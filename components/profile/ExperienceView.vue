<script lang="ts" setup>
  import AddExperienceForm from '~/components/profile/AddExperienceForm.vue';
  import EmptyExperienceCard from '~/components/profile/EmptyExperienceCard.vue';
  import ExperienceCard from '~/components/profile/ExperienceCard.vue';
  import { useProfile } from '~/composables/useProfile';

  const {
    hasExperiences,
    canAddExperience,
    isAddingExperience,
    isAddExperienceModalVisible,
    toggleAddExperienceModal,
    addExperience,
    experiences,
  } = useProfile();
</script>

<template>
  <div class="flex flex-col gap-4 my-12 mr-8 w-full">
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

    <div v-if="hasExperiences" class="flex flex-row md:flex-col py-2">
      <div
        class="flex flex-col border-b border-gray-200 md:flex-row justify-start md:justify-between w-full"
      >
        <div class="flex flex-col gap-2 py-2">
          <h3 class="text-3xl font-semibold text-gray-900">Experience</h3>
          <p>Add your work experience</p>
        </div>

        <UButton
          class="font-medium h-fit"
          color="primary"
          icon="i-heroicons-plus-circle-solid"
          label="Add Experience"
          size="xl"
          @click="toggleAddExperienceModal"
        />
      </div>

      <div class="flex flex-col gap-4 mt-4">
        <ExperienceCard
          v-for="experience in experiences"
          :key="experience.id"
          :experience="experience"
        />
      </div>
    </div>

    <EmptyExperienceCard v-else />
  </div>
</template>

<style scoped></style>
