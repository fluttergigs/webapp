<script lang="ts" setup>
  import { AcademicCapIcon } from '@heroicons/vue/24/solid';
  import { useProfile } from '~/composables/useProfile';

  const { toggleAddEducationModal } = useProfile();
</script>

<template>
  <div
    class="flex flex-col items-center justify-center gap-4 p-8 border border-dashed border-gray-300 rounded-lg bg-gray-50"
  >
    <div class="flex flex-col items-center text-center gap-2">
      <div class="rounded-md p-4 border border-gray-200" style="width: fit-content">
        <AcademicCapIcon class="w-12 h-12 text-gray-500" />
      </div>
      <h3 class="text-2xl font-semibold text-gray-900">No education added yet</h3>
      <p class="text-gray-600 max-w-md">
        Share your educational background to highlight your academic achievements and
        qualifications. Add information about your degrees, fields of study, and institutions.
      </p>
    </div>

    <UButton
      class="mt-2 font-medium"
      color="primary"
      icon="i-heroicons-plus-circle-solid"
      label="Add Education"
      size="xl"
      @click="toggleAddEducationModal"
    />
  </div>
</template>
