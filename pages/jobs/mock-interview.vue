<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue';
import { useJobStore } from '~/stores/job';
import type { MockInterviewRequest } from '~/features/jobs/job.types';

// SEO and meta
useHead({
  title: 'Mock Interview - Flutter Gigs',
  meta: [
    { name: 'description', content: 'Practice for your Flutter job interview with AI-generated questions based on real job postings.' }
  ]
});

const jobStore = useJobStore();

// Form state
const jobPostUrl = ref('');
const jobDescription = ref('');
const questionCount = ref(5);
const difficulty = ref('mixed');
const activeTab = ref('url'); // 'url' or 'description'

// Loading and error states
const isGenerating = computed(() => jobStore.isMockInterviewLoading);
const generationError = computed(() => jobStore.mockInterviewError);
const questions = computed(() => jobStore.mockInterviewQuestions);

// Interview session state
const currentSession = computed(() => jobStore.currentInterviewSession);
const currentQuestion = computed(() => jobStore.currentQuestion);
const isInterviewComplete = computed(() => jobStore.isInterviewComplete);
const currentAnswer = ref('');

// Form validation
const canGenerate = computed(() => {
  if (activeTab.value === 'url') {
    return jobPostUrl.value.trim().length > 0;
  } else {
    return jobDescription.value.trim().length > 10;
  }
});

const canStartInterview = computed(() => {
  return questions.value.length > 0 && !currentSession.value;
});

// Methods
const generateQuestions = async () => {
  if (!canGenerate.value) return;
  
  const request: MockInterviewRequest = {
    questionCount: questionCount.value,
    difficulty: difficulty.value as any,
  };
  
  if (activeTab.value === 'url') {
    request.jobPostUrl = jobPostUrl.value;
  } else {
    request.jobDescription = jobDescription.value;
  }
  
  try {
    await jobStore.generateMockInterview(request);
  } catch (error) {
    console.error('Failed to generate mock interview:', error);
  }
};

const startInterview = () => {
  if (questions.value.length > 0) {
    jobStore.startMockInterviewSession(questions.value);
    currentAnswer.value = '';
  }
};

const submitAnswer = () => {
  if (currentAnswer.value.trim()) {
    jobStore.answerMockInterviewQuestion(currentAnswer.value);
    currentAnswer.value = '';
    
    if (isInterviewComplete.value) {
      jobStore.finishMockInterviewSession();
    }
  }
};

const resetInterview = () => {
  jobStore.resetMockInterview();
  currentAnswer.value = '';
  jobPostUrl.value = '';
  jobDescription.value = '';
};

onMounted(() => {
  // Reset any existing interview session when component mounts
  jobStore.resetMockInterview();
});
</script>

<template>
  <main class="min-h-screen bg-gray-50">
    <section class="w-full px-4 py-8 md:py-12">
      <div class="mx-auto max-w-4xl">
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
        <div v-if="currentSession" class="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-xl font-semibold text-gray-900">Interview Session</h2>
            <div class="text-sm text-gray-500">
              Question {{ currentSession.currentQuestionIndex + 1 }} of {{ currentSession.questions.length }}
            </div>
          </div>

          <!-- Progress Bar -->
          <div class="w-full bg-gray-200 rounded-full h-2 mb-6">
            <div 
              class="bg-indigo-600 h-2 rounded-full transition-all duration-300"
              :style="{ width: `${(currentSession.currentQuestionIndex / currentSession.questions.length) * 100}%` }"
            ></div>
          </div>

          <!-- Current Question -->
          <div v-if="!isInterviewComplete" class="mb-6">
            <div class="mb-4">
              <span class="inline-block px-3 py-1 text-xs font-medium bg-indigo-100 text-indigo-800 rounded-full mb-2">
                {{ currentQuestion?.category || 'General' }} • {{ currentQuestion?.difficulty || 'Medium' }}
              </span>
              <h3 class="text-lg font-medium text-gray-900 mb-4">
                {{ currentQuestion?.question }}
              </h3>
            </div>

            <!-- Answer Input -->
            <div class="mb-4">
              <label for="answer" class="block text-sm font-medium text-gray-700 mb-2">
                Your Answer
              </label>
              <textarea
                id="answer"
                v-model="currentAnswer"
                rows="6"
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Type your answer here..."
              ></textarea>
            </div>

            <!-- Hints -->
            <div v-if="currentQuestion?.hints?.length" class="mb-4">
              <button 
                class="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                @click="$event.target.nextElementSibling.classList.toggle('hidden')"
              >
                💡 Show Hints
              </button>
              <div class="hidden mt-2 p-3 bg-blue-50 rounded-md">
                <ul class="text-sm text-blue-800 space-y-1">
                  <li v-for="hint in currentQuestion.hints" :key="hint" class="flex items-start">
                    <span class="mr-2">•</span>
                    {{ hint }}
                  </li>
                </ul>
              </div>
            </div>

            <UButton
              :disabled="!currentAnswer.trim()"
              @click="submitAnswer"
              size="lg"
              class="bg-indigo-600 hover:bg-indigo-700"
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
              <div class="text-3xl font-bold text-indigo-600 mb-2">
                {{ currentSession.score }}%
              </div>
              <p class="text-sm text-gray-500">Completion Score</p>
            </div>
            <UButton
              @click="resetInterview"
              size="lg"
              variant="outline"
              class="mr-4"
            >
              Start New Interview
            </UButton>
          </div>
        </div>

        <!-- Question Generation Form -->
        <div v-else class="bg-white rounded-lg shadow-lg p-6">
          <!-- Tab Navigation -->
          <div class="flex border-b border-gray-200 mb-6">
            <button
              @click="activeTab = 'url'"
              :class="[
                'py-2 px-4 text-sm font-medium border-b-2 transition-colors',
                activeTab === 'url' 
                  ? 'border-indigo-500 text-indigo-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              ]"
            >
              Job Post URL
            </button>
            <button
              @click="activeTab = 'description'"
              :class="[
                'py-2 px-4 text-sm font-medium border-b-2 transition-colors',
                activeTab === 'description' 
                  ? 'border-indigo-500 text-indigo-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              ]"
            >
              Job Description
            </button>
          </div>

          <!-- URL Tab -->
          <div v-if="activeTab === 'url'" class="mb-6">
            <label for="jobUrl" class="block text-sm font-medium text-gray-700 mb-2">
              Job Post URL *
            </label>
            <input
              id="jobUrl"
              v-model="jobPostUrl"
              type="url"
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="https://example.com/job-posting"
            />
            <p class="text-xs text-gray-500 mt-1">
              Paste the URL of the job posting you want to practice for
            </p>
          </div>

          <!-- Description Tab -->
          <div v-if="activeTab === 'description'" class="mb-6">
            <label for="jobDesc" class="block text-sm font-medium text-gray-700 mb-2">
              Job Description *
            </label>
            <textarea
              id="jobDesc"
              v-model="jobDescription"
              rows="6"
              class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Paste the job description here..."
            ></textarea>
            <p class="text-xs text-gray-500 mt-1">
              Copy and paste the job description you want to practice for
            </p>
          </div>

          <!-- Options -->
          <div class="grid md:grid-cols-2 gap-4 mb-6">
            <div>
              <label for="questionCount" class="block text-sm font-medium text-gray-700 mb-2">
                Number of Questions
              </label>
              <select
                id="questionCount"
                v-model="questionCount"
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option :value="3">3 Questions</option>
                <option :value="5">5 Questions</option>
                <option :value="7">7 Questions</option>
                <option :value="10">10 Questions</option>
              </select>
            </div>
            <div>
              <label for="difficulty" class="block text-sm font-medium text-gray-700 mb-2">
                Difficulty Level
              </label>
              <select
                id="difficulty"
                v-model="difficulty"
                class="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
                <option value="mixed">Mixed</option>
              </select>
            </div>
          </div>

          <!-- Error Message -->
          <div v-if="generationError" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p class="text-sm text-red-600">{{ generationError }}</p>
          </div>

          <!-- Generate Button -->
          <UButton
            :disabled="!canGenerate || isGenerating"
            :loading="isGenerating"
            @click="generateQuestions"
            size="lg"
            class="w-full bg-indigo-600 hover:bg-indigo-700"
          >
            {{ isGenerating ? 'Generating Questions...' : 'Generate Interview Questions' }}
          </UButton>
        </div>

        <!-- Generated Questions Preview -->
        <div v-if="questions.length > 0 && !currentSession" class="bg-white rounded-lg shadow-lg p-6 mt-6">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-semibold text-gray-900">Generated Questions</h2>
            <span class="text-sm text-gray-500">{{ questions.length }} questions</span>
          </div>
          
          <div class="space-y-4 mb-6">
            <div 
              v-for="(question, index) in questions" 
              :key="question.id"
              class="border border-gray-200 rounded-lg p-4"
            >
              <div class="flex items-start justify-between mb-2">
                <span class="text-sm font-medium text-gray-900">Question {{ index + 1 }}</span>
                <span class="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                  {{ question.category }} • {{ question.difficulty }}
                </span>
              </div>
              <p class="text-gray-700">{{ question.question }}</p>
            </div>
          </div>

          <UButton
            :disabled="!canStartInterview"
            @click="startInterview"
            size="lg"
            class="w-full bg-green-600 hover:bg-green-700"
          >
            Start Interview Practice
          </UButton>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
/* Add any custom styles here */
</style>