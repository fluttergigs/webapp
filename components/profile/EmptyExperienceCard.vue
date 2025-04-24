<script lang="ts" setup>
  import { BriefcaseIcon } from '@heroicons/vue/24/solid';
  import { useProfile } from '~/composables/useProfile';
</script>

<template>
  <div
    class="px-4 py-8 border border-gray-200 rounded-md w-full border-dashed border-gray-300 rounded-lg bg-gray-50"
  >
    <div class="flex flex-col gap-3 justify-center items-center">
      <div class="rounded-md p-4 border border-gray-200" style="width: fit-content">
        <BriefcaseIcon class="w-12 h-12 text-gray-500" />
      </div>

      <h3 class="text-xl font-semibold text-center mt-4">No Experience yet</h3>

      <p class="text-sm text-gray-600 text-center mt-2 max-w-xl">
        It seems like you haven't added any experience to your profile yet. To make the most of your
        profile and increase your chances of getting hired, we recommend adding your work
        experience,
      </p>

      <UButton
        class="flex gap-2 rounded-xl px-6 py-4 font-medium"
        color="primary"
        icon="i-heroicons-plus-circle-solid"
        label="Add experience"
        @click="useProfile().toggleAddExperienceModal"
      />
    </div>
  </div>
</template>

<style scoped></style>
