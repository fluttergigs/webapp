<!-- EducationDateDisplay.vue -->
<template>
  <p class="text-md font-medium">
    <!-- For active education -->
    <template v-if="education.isActive">
      <span>{{ education.startYear }}</span> - <span>Present</span>
    </template>

    <!-- For completed education -->
    <template v-else>
      <!-- If start and end years are the same, display the range then the year once -->
      <template v-if="isSameYear">
        <span>{{ education.startYear }}</span> - <span>{{ education.endYear }}</span>
        <span class="ml-1">({{ education.startYear }})</span>
      </template>
      <!-- Otherwise, display both years normally -->
      <template v-else>
        <span>{{ education.startYear }}</span> - <span>{{ education.endYear }}</span>
      </template>
    </template>
  </p>
</template>

<script lang="ts" setup>
  import type { Education } from '~/features/users/user.types';

  import { computed, defineProps } from 'vue';

  const props = defineProps<{ education: Education }>();

  const isSameYear = computed(() => {
    // If no endYear, then nothing to compare
    if (!props.education.endYear) return false;
    return props.education.startYear === props.education.endYear;
  });
</script>

<style scoped>
  /* Add your styles as needed */
</style>
