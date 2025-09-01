import { storeToRefs } from 'pinia';
import { BaseToast } from '~/core/ui/base_toast';
import type { MockInterviewRequest } from '~/features/mockInterview/mockInterview.types';
import { useMockInterviewStore } from '~/stores/mockInterview';

import { computed, ref } from 'vue';
import { AnalyticsEvent } from '~/services/analytics/events';

export function useMockInterviews() {
  const mockInterviewStore = useMockInterviewStore();

  const { $toast } = useNuxtApp();
  // Store refs
  const { mockInterviewGeneration, currentMockInterview, mockInterviewError } =
    storeToRefs(mockInterviewStore);

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
      await mockInterviewStore.generateMockInterview(request);
    } catch (error) {
      ($toast as BaseToast<Notification>).error(mockInterviewError.value);
    }
  };

  const startInterview = () => {
    if (questions.value.length > 0) {
      mockInterviewStore.startMockInterviewSession(questions.value);
      useAnalytics().capture(AnalyticsEvent.mockInterviewStarted);
      currentAnswer.value = '';
    }
  };

  const submitAnswer = () => {
    if (currentAnswer.value.trim()) {
      mockInterviewStore.answerMockInterviewQuestion(currentAnswer.value);
      useAnalytics().capture(AnalyticsEvent.mockInterviewQuestionAnswered);
      currentAnswer.value = '';

      if (isInterviewComplete.value) {
        mockInterviewStore.finishMockInterviewSession();
        useAnalytics().capture(AnalyticsEvent.mockInterviewCompleted);
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


    useAnalytics().capture(AnalyticsEvent.mockInterviewPageEntered);
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
    generationError: mockInterviewError.value,
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
