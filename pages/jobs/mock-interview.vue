<script lang="ts" setup>
import { onMounted } from 'vue';
import { useMockInterviews } from '~/composables/useMockInterviews';

// Page metadata
definePageMeta({
  layout: 'app-layout',
  middleware: 'auth',
  title: 'Mock Interview Practice',
});

// SEO and meta
useHead({
  title: 'Mock Interview Practice - Flutter Gigs',
  meta: [
    { name: 'description', content: 'Practice for your Flutter job interview with AI-generated questions based on real job postings.' }
  ]
});

// Use the mock interviews composable
const {
  // Form state
  jobPostUrl,
  jobDescription,
  questionCount,
  difficulty,
  activeTab,
  currentAnswer,
  
  // Computed properties
  isGenerating,
  generationError,
  questions,
  currentSession,
  currentQuestion,
  isInterviewComplete,
  canGenerate,
  canStartInterview,
  
  // Options
  questionCountOptions,
  difficultyOptions,
  
  // Methods
  generateQuestions,
  startInterview,
  submitAnswer,
  resetInterview,
  switchTab,
  initialize,
} = useMockInterviews();

// Tab items for UTabs
const tabItems = [
  {
    key: 'url',
    label: 'Job Post URL',
    description: 'Paste a job posting URL'
  },
  {
    key: 'description', 
    label: 'Job Description',
    description: 'Enter job description directly'
  }
];

onMounted(() => {
  initialize();
});
</script>

<template>
  <main class="min-h-screen bg-gray-50">
    <div class="mx-auto max-w-4xl px-4 py-8 md:py-12">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Mock Interview Practice
        </h1>
        <p class="text-lg text-gray-600 max-w-2xl mx-auto">
          Get ready for your Flutter job interview with AI-generated questions based on real job postings. 
          Practice your responses and build confidence.
        </p>
      </div>

      <!-- Interview Session View -->
      <UCard v-if="currentSession" class="mb-6">
        <template #header>
          <div class="flex justify-between items-center">
            <h2 class="text-xl font-semibold text-gray-900">Interview Session</h2>
            <div class="text-sm text-gray-500">
              Question {{ currentSession.currentQuestionIndex + 1 }} of {{ currentSession.questions.length }}
            </div>
          </div>
        </template>

        <!-- Progress Bar -->
        <UProgress 
          :value="(currentSession.currentQuestionIndex / currentSession.questions.length) * 100"
          class="mb-6"
        />

        <!-- Current Question -->
        <div v-if="!isInterviewComplete" class="space-y-6">
          <div>
            <div class="flex gap-2 mb-4">
              <UBadge 
                :label="currentQuestion?.category || 'General'" 
                color="blue" 
                variant="subtle"
              />
              <UBadge 
                :label="currentQuestion?.difficulty || 'Medium'" 
                :color="currentQuestion?.difficulty === 'hard' ? 'red' : currentQuestion?.difficulty === 'easy' ? 'green' : 'orange'"
                variant="subtle"
              />
            </div>
            <h3 class="text-lg font-medium text-gray-900 mb-4">
              {{ currentQuestion?.question }}
            </h3>
          </div>

          <!-- Answer Input -->
          <div>
            <UFormGroup label="Your Answer" name="answer">
              <UTextarea
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
            :items="[{
              label: '💡 Show Hints',
              content: currentQuestion.hints.map(hint => `• ${hint}`).join('\n'),
              defaultOpen: false
            }]"
          />

          <UButton
            :disabled="!currentAnswer.trim()"
            @click="submitAnswer"
            size="lg"
            class="w-full"
          >
            {{ currentSession.currentQuestionIndex === currentSession.questions.length - 1 ? 'Finish Interview' : 'Next Question' }}
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
            <div class="text-3xl font-bold text-primary-600 mb-2">
              {{ currentSession.score }}%
            </div>
            <p class="text-sm text-gray-500">Completion Score</p>
          </div>
          <UButton
            @click="resetInterview"
            size="lg"
            variant="outline"
          >
            Start New Interview
          </UButton>
        </div>
      </UCard>

      <!-- Question Generation Form -->
      <UCard v-else>
        <template #header>
          <h2 class="text-xl font-semibold text-gray-900">Generate Interview Questions</h2>
        </template>

        <!-- Tab Navigation -->
        <UTabs 
          :items="tabItems" 
          v-model="activeTab"
          class="mb-6"
        >
          <!-- URL Tab -->
          <template #url="{ item }">
            <div class="space-y-4">
              <UFormGroup 
                label="Job Post URL" 
                description="Paste the URL of the job posting you want to practice for"
                required
              >
                <UInput
                  v-model="jobPostUrl"
                  type="url"
                  placeholder="https://example.com/job-posting"
                  size="lg"
                />
              </UFormGroup>
            </div>
          </template>

          <!-- Description Tab -->
          <template #description="{ item }">
            <div class="space-y-4">
              <UFormGroup 
                label="Job Description" 
                description="Copy and paste the job description you want to practice for"
                required
              >
                <UTextarea
                  v-model="jobDescription"
                  :rows="6"
                  placeholder="Paste the job description here..."
                  size="lg"
                />
              </UFormGroup>
            </div>
          </template>
        </UTabs>

        <!-- Options -->
        <div class="grid md:grid-cols-2 gap-4 mb-6">
          <UFormGroup label="Number of Questions">
            <USelectMenu
              v-model="questionCount"
              :options="questionCountOptions"
              value-attribute="value"
              option-attribute="label"
              size="lg"
            />
          </UFormGroup>
          
          <UFormGroup label="Difficulty Level">
            <USelectMenu
              v-model="difficulty"
              :options="difficultyOptions"
              value-attribute="value"
              option-attribute="label"
              size="lg"
            />
          </UFormGroup>
        </div>

        <!-- Error Message -->
        <UAlert
          v-if="generationError"
          color="red"
          variant="subtle"
          :title="generationError"
          class="mb-4"
        />

        <!-- Generate Button -->
        <UButton
          :disabled="!canGenerate"
          :loading="isGenerating"
          @click="generateQuestions"
          size="lg"
          class="w-full"
        >
          Generate Interview Questions
        </UButton>
      </UCard>

      <!-- Generated Questions Preview -->
      <UCard v-if="questions.length > 0 && !currentSession" class="mt-6">
        <template #header>
          <div class="flex justify-between items-center">
            <h2 class="text-xl font-semibold text-gray-900">Generated Questions</h2>
            <UBadge :label="`${questions.length} questions`" />
          </div>
        </template>
        
        <div class="space-y-4 mb-6">
          <UCard 
            v-for="(question, index) in questions" 
            :key="question.id"
            :ui="{ body: { padding: 'p-4' } }"
          >
            <div class="flex items-start justify-between mb-2">
              <span class="text-sm font-medium text-gray-900">Question {{ index + 1 }}</span>
              <div class="flex gap-2">
                <UBadge :label="question.category" color="blue" variant="subtle" size="xs" />
                <UBadge 
                  :label="question.difficulty" 
                  :color="question.difficulty === 'hard' ? 'red' : question.difficulty === 'easy' ? 'green' : 'orange'"
                  variant="subtle" 
                  size="xs"
                />
              </div>
            </div>
            <p class="text-gray-700">{{ question.question }}</p>
          </UCard>
        </div>

        <UButton
          :disabled="!canStartInterview"
          @click="startInterview"
          size="lg"
          color="green"
          class="w-full"
        >
          Start Interview Practice
        </UButton>
      </UCard>
    </div>
  </main>
</template>

