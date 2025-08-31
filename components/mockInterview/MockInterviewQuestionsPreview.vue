<script lang="ts" setup>
  import { useMockInterviews } from '~/composables/useMockInterviews';

  //@ts-ignore
  import MockInterviewQuestionInfo from '@/components/mockInterview/MockInterviewQuestionInfo';

  const { questions, canStartInterview, startInterview } = useMockInterviews();
</script>

<template>
  <UCard class="mt-6">
    <template #header>
      <div class="flex justify-between items-center">
        <h2 class="text-xl font-semibold text-gray-900">Generated Questions</h2>
        <UBadge :label="`${questions.length} questions`" />
      </div>
    </template>

    <div class="space-y-4 mb-6">
      <UCarousel
        v-slot="{ item }"
        :items="questions"
        :ui="{
          dots: '-bottom-0.5',
          dot: 'w-2.5 h-2.5',
        }"
        autoheight
        class="w-full"
        dots
      >
        <UCard :ui="{ body: { padding: 'p-4 w-full' } }" variant="subtle">
          <div class="flex items-start justify-between mb-2 w-full">
            <span class="text-sm font-semibold text-gray-900"
              >Question {{ questions.indexOf(item) + 1 }}</span
            >
            <MockInterviewQuestionInfo :question="item" />
          </div>
          <p class="text-gray-700">{{ item.question }}</p>
        </UCard>
      </UCarousel>
    </div>

    <UButton
      :disabled="!canStartInterview"
      class="w-full"
      color="neutral"
      size="lg"
      @click="startInterview"
    >
      Start Interview Practice
    </UButton>
  </UCard>
</template>

<style scoped></style>
