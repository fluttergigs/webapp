<script lang="ts" setup>
  import MockInterviewQuestionInfo from '@/components/mockInterview/MockInterviewQuestionInfo';

  const {
    currentAnswer,

    // Computed properties
    currentSession,
    currentQuestion,
    isInterviewComplete,

    // Methods
    submitAnswer,
    resetInterview,
  } = useMockInterviews();
</script>

<template>
  <UCard class="mb-6">
    <template #header>
      <div class="flex justify-between items-center">
        <h2 class="text-xl font-semibold text-gray-900">Interview Session</h2>
        <div class="text-sm text-gray-500">
          Question {{ currentSession.currentQuestionIndex + 1 }} of
          {{ currentSession.questions.length }}
        </div>
      </div>
    </template>

    <!-- Progress Bar -->
    <UProgress
      status
      :value="(currentSession.currentQuestionIndex / currentSession.questions.length) * 100"
      :max="100"
      class="mb-6"
    />

    <!-- Current Question -->
    <div v-if="!isInterviewComplete" class="space-y-6">
      <div>
        <MockInterviewQuestionInfo class="mb-4" :question="currentQuestion" />
        <h3 class="text-lg font-medium text-gray-900 mb-4">
          {{ currentQuestion?.question }}
        </h3>
      </div>

      <!-- Answer Input -->
      <div>
        <UFormGroup label="Your Answer" name="answer">
          <UTextarea
            class="w-full"
            v-model="currentAnswer"
            :rows="6"
            placeholder="Type your answer here..."
            size="lg"
          />
        </UFormGroup>
      </div>

      <!-- Hints -->
      <UAccordion
        v-if="currentQuestion?.hints?.length"
        :items="[
          {
            label: '💡 Show Hints',
            content: currentQuestion.hints.map((hint) => `• ${hint}`).join('\n'),
            defaultOpen: false,
          },
        ]"
      />

      <UButton :disabled="!currentAnswer.trim()" class="w-full" size="lg" @click="submitAnswer">
        {{
          currentSession.currentQuestionIndex === currentSession.questions.length - 1
            ? 'Finish Interview'
            : 'Next Question'
        }}
      </UButton>
    </div>

    <!-- Interview Complete -->
    <div v-else class="text-center py-8">
      <div class="text-6xl mb-4">🎉</div>
      <h3 class="text-2xl font-bold text-gray-900 mb-2">Interview Complete!</h3>
      <p class="text-gray-600 mb-4">
        You've completed all {{ currentSession.questions.length }} questions.
      </p>
      <div class="mb-6">
        <div class="text-3xl font-bold text-primary-600 mb-2">{{ currentSession.score }}%</div>
        <p class="text-sm text-gray-500">Completion Score</p>
      </div>
      <UButton size="lg" variant="outline" @click="resetInterview"> Start New Interview</UButton>
    </div>
  </UCard>
</template>

<style scoped></style>
