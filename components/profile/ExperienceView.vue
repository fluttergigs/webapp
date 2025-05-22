<script lang="ts" setup>
  import AddExperienceModal from '~/components/profile/AddExperienceModal.vue';
  import EmptyExperienceCard from '~/components/profile/EmptyExperienceCard.vue';
  import ExperienceCard from '~/components/profile/ExperienceCard.vue';
  import UpdateExperienceModal from '~/components/profile/UpdateExperienceModal.vue';
  import { useProfile } from '~/composables/useProfile';

  const { hasExperiences, addExperienceModal, experiences } = useProfile();
</script>

<template>
  <div class="flex flex-col gap-4 my-12 mr-8 w-full">
    <AddExperienceModal />
    <UpdateExperienceModal />

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
          @click="addExperienceModal.toggle"
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
