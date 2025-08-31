<script lang="ts" setup>
  import type { MockInterviewQuestion } from '~/features/mockInterview/mockInterview.types';

  const props = defineProps<{
    question: MockInterviewQuestion;
  }>();
</script>

<template>
  <div class="flex gap-2">
    <UBadge :label="props.question?.category || 'General'" color="info" variant="soft" />

    <UBadge
      :color="
        props.question?.difficulty === 'hard'
          ? 'warning'
          : props.question?.difficulty === 'easy'
            ? 'primary'
            : 'neutral'
      "
      :label="props.question?.difficulty || 'Medium'"
      variant="subtle"
    />
  </div>
</template>

<style scoped></style>
