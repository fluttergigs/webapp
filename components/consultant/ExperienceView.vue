<script lang="ts" setup>
  import EmptyExperienceCard from '~/components/consultant/EmptyExperienceCard.vue';
  import { useConsultant } from '~/composables/useConsultant';
</script>

<template>
  <div class="flex flex-col space-y-4 my-12 mr-8">
    <div v-if="useConsultant().hasExperiences" class="flex flex-row md:flex-col py-2 border-b">
      <div class="justify-start md:justify-between">
        <div class="flex flex-col gap-2">
          <h3 class="heading-6 font-semibold text-gray-900">Experience</h3>
          <p>Add your work experience</p>
        </div>

        <UButton
          class="flex gap-2 rounded-xl px-9 py-5 font-medium"
          color="indigo"
          icon="i-heroicons-plus-circle-solid"
          label="Add experience"
          @click="useConsultant().toggleAddEducationModal"
        />
      </div>
    </div>

    <EmptyExperienceCard v-else />
  </div>
</template>

<style scoped></style>
