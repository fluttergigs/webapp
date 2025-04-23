<script lang="ts" setup>
  import AddExperienceForm from '~/components/consultant/AddExperienceForm.vue';
  import EmptyExperienceCard from '~/components/consultant/EmptyExperienceCard.vue';
  import { useProfile } from '~/composables/useProfile';

  const { canAddExperience, isAddingExperience } = useProfile();
</script>

<template>
  <div class="flex flex-col space-y-4 my-12 mr-8">
    <div v-if="useProfile().hasExperiences" class="flex flex-row md:flex-col py-2 border-b">
      <div class="justify-start md:justify-between">
        <div class="flex flex-col gap-2">
          <h3 class="heading-6 font-semibold text-gray-900">Experience</h3>
          <p>Add your work experience</p>
        </div>

        <UModal size="lg" title="Add experience">
          <UButton
            class="flex gap-2 rounded-xl px-9 py-5 font-medium"
            color="primary"
            icon="i-heroicons-plus-circle-solid"
            label="Add experience"
          />

          <template #body>
            <AddExperienceForm />
          </template>

          <template #footer>
            <div class="flex gap-2">
              <UButton
                :disabled="!canAddExperience"
                :loading="isAddingExperience"
                class="flex gap-2 rounded-xl px-9 py-5 font-medium"
                color="primary"
                label="Add experience"
                @click="useProfile().toggleAddEducationModal"
              />
            </div>
          </template>
        </UModal>
      </div>
    </div>

    <EmptyExperienceCard v-else />
  </div>
</template>

<style scoped></style>
