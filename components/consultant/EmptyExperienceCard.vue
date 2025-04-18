<script lang="ts" setup>
  import { AcademicCapIcon } from '@heroicons/vue/24/solid';
  import { useConsultant } from '~/composables/useConsultant';
</script>

<template>
  <div class="px-4 py-8 border rounded-md w-fit">
    <div class="flex flex-col gap-3 justify-center items-center">
      <div class="rounded-md p-4 border" style="width: fit-content">
        <AcademicCapIcon class="w-12 h-12 text-gray-800" />
      </div>

      <h3 class="text-xl font-semibold text-center mt-4">No Experience yet</h3>

      <p class="text-sm text-gray-600 text-center mt-2 max-w-xl">
        It seems like you haven't added any experience to your profile yet. To make the most of your
        profile and increase your chances of getting hired, we recommend adding your work
        experience,
      </p>

      <UButton
        class="flex gap-2 rounded-xl px-6 py-4 font-medium"
        color="indigo"
        icon="i-heroicons-plus-circle-solid"
        label="Add experience"
        @click="useConsultant().toggleAddEducationModal"
      />
    </div>
  </div>
</template>

<style scoped></style>
