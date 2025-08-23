import { ref, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useJobStore } from '~/stores/job';
import type { MockInterviewRequest } from '~/features/jobs/job.types';

export function useMockInterviews() {
  const jobStore = useJobStore();
  
  // Store refs
  const { 
    mockInterviewGeneration, 
    currentMockInterview 
  } = storeToRefs(jobStore);

  // Local form state
  const jobPostUrl = ref('');
  const jobDescription = ref('');
  const questionCount = ref(5);
  const difficulty = ref('mixed');
  const activeTab = ref('url'); // 'url' or 'description'
  const currentAnswer = ref('');

  // Computed properties
  const isGenerating = computed(() => mockInterviewGeneration.value?.isLoading ?? false);
  const generationError = computed(() => mockInterviewGeneration.value?.error);
  const questions = computed(() => mockInterviewGeneration.value?.value?.questions ?? []);
  const currentSession = computed(() => currentMockInterview.value);
  const currentQuestion = computed(() => {
    if (currentMockInterview.value) {
      return currentMockInterview.value.questions[currentMockInterview.value.currentQuestionIndex];
    }
    return null;
  });
  const isInterviewComplete = computed(() => {
    if (currentMockInterview.value) {
      return currentMockInterview.value.currentQuestionIndex >= currentMockInterview.value.questions.length;
    }
    return false;
  });

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

  // Question count options
  const questionCountOptions = [
    { label: '3 Questions', value: 3 },
    { label: '5 Questions', value: 5 },
    { label: '7 Questions', value: 7 },
    { label: '10 Questions', value: 10 }
  ];

  // Difficulty options
  const difficultyOptions = [
    { label: 'Easy', value: 'easy' },
    { label: 'Medium', value: 'medium' },
    { label: 'Hard', value: 'hard' },
    { label: 'Mixed', value: 'mixed' }
  ];

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

  const switchTab = (tab: 'url' | 'description') => {
    activeTab.value = tab;
  };

  // Initialize
  const initialize = () => {
    jobStore.resetMockInterview();
  };

  return {
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
  };
}