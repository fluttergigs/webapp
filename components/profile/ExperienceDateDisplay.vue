<template>
  <p>
    <!-- When the dates are in the same year -->
    <template v-if="isSameYear(experience.startDate, experience.endDate) && !experience.isActive">
      <span v-date-format="{ date: experience.startDate, format: 'MMM D' }"></span>
      -
      <span v-date-format="{ date: experience.endDate, format: 'MMM D' }"></span>
      <span v-date-format="{ date: experience.startDate, format: 'YYYY' }"></span>
    </template>

    <!-- When the experience is active (assuming you want 'Present') -->
    <template v-else-if="experience.isActive">
      <span v-date-format="{ date: experience.startDate, format: 'MMM D' }"></span>
      -
      <span class="text-md font-medium">Present</span>
      <!-- If necessary, you can also show the year after start date -->
      <span v-date-format="{ date: experience.startDate, format: 'YYYY' }"></span>
    </template>

    <!-- When the dates are in different years -->
    <template v-else>
      <span v-date-format="{ date: experience.startDate, format: 'MMM D, YYYY' }"></span>
      -
      <span v-date-format="{ date: experience.endDate, format: 'MMM D, YYYY' }"></span>
    </template>
  </p>
</template>

<script lang="ts" setup>
  import type { Experience } from '~/features/users/user.types';

  defineProps<{ experience: Experience }>();

  const isSameYear = (startDate: Date | string, endDate: Date | string | null): boolean => {
    if (!endDate) return false; // If no end date, we can't compare

    const startYear = new Date(startDate).getFullYear();
    const endYear = new Date(endDate).getFullYear();
    return startYear === endYear;
  };
</script>
