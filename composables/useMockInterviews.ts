import { storeToRefs } from 'pinia';
import { BaseToast } from '~/core/ui/base_toast';
import type { MockInterviewRequest } from '~/features/mockInterview/mockInterview.types';
import { useMockInterviewStore } from '~/stores/mockInterview';

import { computed, ref, onMounted } from 'vue';

export function useMockInterviews() {
  const mockInterviewStore = useMockInterviewStore();

  const { $toast } = useNuxtApp();
  // Store refs
  const { 
    mockInterviewGeneration, 
    currentMockInterview, 
    mockInterviewError,
    usageCheck,
    isUsageLoading,
    usageError,
    canUseInterview,
    currentUsage
  } = storeToRefs(mockInterviewStore);

  // Local form state
  const jobPostUrl = ref('');
  const jobDescription = ref('');
  const questionCount = ref(5);
  const difficulty = ref('mixed');
  const activeTab = ref('url'); // 'url' or 'description'
  const currentAnswer = ref('');

  // Computed properties
  const isGenerating = computed(() => mockInterviewGeneration.value?.isLoading ?? false);
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
      return (
        currentMockInterview.value.currentQuestionIndex >=
        currentMockInterview.value.questions.length
      );
    }
    return false;
  });

  // Form validation
  const canGenerate = computed(() => {
    const hasValidInput = activeTab.value === 'url' 
      ? jobPostUrl.value.trim().length > 0
      : jobDescription.value.trim().length > 10;
    
    // Also check usage limits
    return hasValidInput && canUseInterview.value;
  });

  const canStartInterview = computed(() => {
    return questions.value.length > 0 && !currentSession.value;
  });

  // Usage information computed properties
  const usageInfo = computed(() => {
    if (!currentUsage.value) return null;
    
    return {
      current: currentUsage.value.currentCount,
      limit: currentUsage.value.limit,
      remaining: currentUsage.value.limit - currentUsage.value.currentCount,
      tier: currentUsage.value.tier,
      message: currentUsage.value.message,
    };
  });

  const isAtLimit = computed(() => {
    return currentUsage.value ? !currentUsage.value.canUse : false;
  });

  // Question count options
  const questionCountOptions = [
    { label: '3 Questions', value: 3 },
    { label: '5 Questions', value: 5 },
    { label: '7 Questions', value: 7 },
    { label: '10 Questions', value: 10 },
  ];

  // Difficulty options
  const difficultyOptions = [
    { label: 'Easy', value: 'easy' },
    { label: 'Medium', value: 'medium' },
    { label: 'Hard', value: 'hard' },
    { label: 'Mixed', value: 'mixed' },
  ];

  // Methods
  const checkUsage = async () => {
    try {
      await mockInterviewStore.checkUsageLimit();
    } catch (error) {
      console.warn('Failed to check usage limits:', error);
    }
  };

  const generateQuestions = async () => {
    if (!canGenerate.value) {
      if (!canUseInterview.value) {
        ($toast as BaseToast<Notification>).error(
          usageInfo.value?.message || 'You have reached your interview limit'
        );
      }
      return;
    }

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
      await mockInterviewStore.generateMockInterview(request);
    } catch (error) {
      ($toast as BaseToast<Notification>).error(mockInterviewError.value);
    }
  };

  const startInterview = () => {
    if (questions.value.length > 0) {
      mockInterviewStore.startMockInterviewSession(questions.value);
      currentAnswer.value = '';
    }
  };

  const submitAnswer = () => {
    if (currentAnswer.value.trim()) {
      mockInterviewStore.answerMockInterviewQuestion(currentAnswer.value);
      currentAnswer.value = '';

      if (isInterviewComplete.value) {
        mockInterviewStore.finishMockInterviewSession();
      }
    }
  };

  const resetInterview = () => {
    mockInterviewStore.resetMockInterview();
    currentAnswer.value = '';
    jobPostUrl.value = '';
    jobDescription.value = '';
  };

  const switchTab = (tab: 'url' | 'description') => {
    activeTab.value = tab;
  };

  // Initialize
  const initialize = () => {
    mockInterviewStore.resetMockInterview();
    checkUsage(); // Check usage limits on initialization
  };

  // Check usage on component mount
  onMounted(() => {
    checkUsage();
  });

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
    generationError: mockInterviewError.value,
    questions,
    currentSession,
    currentQuestion,
    isInterviewComplete,
    canGenerate,
    canStartInterview,

    // Usage tracking
    usageInfo,
    isAtLimit,
    isUsageLoading,
    usageError,
    canUseInterview,
    currentUsage,

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
    checkUsage,
  };
}
