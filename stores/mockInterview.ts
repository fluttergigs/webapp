import { defineStore } from 'pinia';
import { Wrapper } from '~/core/wrapper';
import { logDev } from '~/core/helpers/log';
import { AppStrings } from '~/core/strings';
import type {
  MockInterviewRequest,
  MockInterviewResponse,
  MockInterviewSession,
  UsageCheckResult,
} from '~/features/mockInterview/mockInterview.types';
import { GenerativeAIProvider } from '~/services/ai/GenerativeAIProvider';
import type { HttpClient } from '~/core/network/http_client';

export const useMockInterviewStore = defineStore('mockInterview', {
  state: () => ({
    mockInterviewGeneration: new Wrapper<MockInterviewResponse>().toInitial(),
    currentMockInterview: null as MockInterviewSession | null,
    usageCheck: new Wrapper<UsageCheckResult>().toInitial(),
  }),

  actions: {
    async checkUsageLimit(): Promise<UsageCheckResult> {
      this.usageCheck = new Wrapper<UsageCheckResult>().toLoading();
      
      try {
        const authStore = useAuthStore();
        const userId = authStore.authUser?.id;
        
        if (!userId) {
          throw new Error('User not authenticated');
        }

        const { $http } = useNuxtApp();
        const response = await (<HttpClient>$http).get<{ success: boolean; data: UsageCheckResult }>(`/api/interview-usage?userId=${userId}`);
        
        this.usageCheck = this.usageCheck.toSuccess(response.data);
        return response.data;
      } catch (error) {
        logDev('Error checking usage limit:', error);
        const errorResult: UsageCheckResult = {
          canUse: false,
          currentCount: 0,
          limit: 3,
          tier: 'free' as any,
          message: 'Unable to check usage limits',
        };
        this.usageCheck = this.usageCheck.toFailed('Unable to check usage limits');
        return errorResult;
      }
    },

    async recordUsage(sessionId: string): Promise<void> {
      try {
        const authStore = useAuthStore();
        const userId = authStore.authUser?.id;
        
        if (!userId) {
          throw new Error('User not authenticated');
        }

        const { $http } = useNuxtApp();
        await (<HttpClient>$http).post('/api/interview-usage', {
          userId,
          sessionId,
        });
      } catch (error) {
        logDev('Error recording usage:', error);
        // Don't throw here to avoid disrupting the interview flow
      }
    },

    async generateMockInterview(request: MockInterviewRequest) {
      // Check usage limit before generating
      const usageResult = await this.checkUsageLimit();
      if (!usageResult.canUse) {
        this.mockInterviewGeneration = new Wrapper<MockInterviewResponse>().toFailed(
          usageResult.message || 'Usage limit exceeded'
        );
        throw new Error(usageResult.message || 'Usage limit exceeded');
      }

      // Parse the JSON response
      let parsedResponse: MockInterviewResponse;
      this.mockInterviewGeneration = new Wrapper<MockInterviewResponse>().toLoading();
      
      try {
        //@ts-ignore
        const { $generativeAI } = useNuxtApp();

        // Create a prompt for generating interview questions
        const questionCount = request.questionCount || 5;
        const difficulty = request.difficulty || 'mixed';

        let prompt = '';
        if (request.jobPostUrl) {
          prompt = `Based on the job posting at this URL: ${request.jobPostUrl}, generate ${questionCount} mock interview questions with ${difficulty} difficulty. `;
        } else if (request.jobDescription) {
          prompt = `Based on this job description: "${request.jobDescription}", generate ${questionCount} mock interview questions with ${difficulty} difficulty. `;
        } else {
          throw new Error('Either job post URL or job description is required');
        }

        prompt += `Format the response as a JSON object with the following structure:
        {
          "jobTitle": "extracted job title",
          "company": "extracted company name",
          "summary": "brief summary of the role",
          "questions": [
            {
              "id": "unique_id",
              "question": "interview question text",
              "category": "technical|behavioral|situational|company-specific",
              "difficulty": "easy|medium|hard",
              "expectedAnswer": "brief guidance on what to include in answer",
              "hints": ["hint1", "hint2"]
            }
          ]
        }
        
        Make sure questions are relevant to Flutter development and the specific role requirements. Include a mix of technical, behavioral, and role-specific questions.`;

        const response = await (<GenerativeAIProvider>$generativeAI).generateText(prompt);

        logDev('AI Response:', response);

        try {
          // Clean the response to remove markdown code block markers
          let cleanedResponse = (response as string).trim();

          // Remove ```json at the beginning if present
          if (cleanedResponse.startsWith('```json')) {
            cleanedResponse = cleanedResponse.substring(7).trim();
          }

          // Remove ``` at the end if present
          if (cleanedResponse.endsWith('```')) {
            cleanedResponse = cleanedResponse.substring(0, cleanedResponse.length - 3).trim();
          }

          parsedResponse = JSON.parse(cleanedResponse);
        } catch (parseError) {

          logDev('JSON parsing error', parseError);
          // If JSON parsing fails, create a fallback response
          parsedResponse = {
            questions: [
              {
                id: '1',
                question: 'Tell me about your experience with Flutter development.',
                category: 'technical',
                difficulty: 'easy',
                expectedAnswer: 'Discuss your Flutter projects, experience with Dart, and key concepts you\'ve worked with.',
                hints: ['Mention specific projects', 'Discuss challenges faced', 'Highlight achievements'],
              },
            ],
            jobTitle: 'Flutter Developer',
            company: 'Unknown',
            summary: 'Flutter development position',
          };
        }

        this.mockInterviewGeneration = this.mockInterviewGeneration.toSuccess(parsedResponse, AppStrings.mockInterviewGeneratedSuccessfully);
      } catch (e) {
        logDev('mock interview generation error', e);

        this.mockInterviewGeneration = this.mockInterviewGeneration.toFailed(AppStrings.unableToGenerateMockInterview);
        throw e;
      }
    },

    startMockInterviewSession(questions: any[]) {
      const session: MockInterviewSession = {
        id: Date.now().toString(),
        questions,
        currentQuestionIndex: 0,
        answers: [],
        startTime: new Date(),
      };
      this.currentMockInterview = session;
      
      // Record usage when starting the session
      this.recordUsage(session.id);
      
      return session;
    },

    answerMockInterviewQuestion(answer: string) {
      if (this.currentMockInterview) {
        this.currentMockInterview.answers.push(answer);

        // Automatically move to next question after answering
        this.moveToNextQuestion();
      }
    },

    moveToNextQuestion() {
      if (!this.isInterviewComplete) {
        this.currentMockInterview.currentQuestionIndex++;
      }
    },

    finishMockInterviewSession() {
      if (this.currentMockInterview) {
        this.currentMockInterview.endTime = new Date();
        // Calculate a simple score based on completion
        const completionRate = this.currentMockInterview.answers.length / this.currentMockInterview.questions.length;
        this.currentMockInterview.score = Math.round(completionRate * 100);
      }
    },

    resetMockInterview() {
      this.currentMockInterview = null;
      this.mockInterviewGeneration = new Wrapper<MockInterviewResponse>().toInitial();
      this.usageCheck = new Wrapper<UsageCheckResult>().toInitial();
    },
  },

  getters: {
    mockInterviewQuestions: (state) => state.mockInterviewGeneration?.value?.questions ?? [],
    isMockInterviewLoading: (state) => state.mockInterviewGeneration?.isLoading ?? false,
    mockInterviewError: (state) => state.mockInterviewGeneration?.message,
    currentInterviewSession: (state) => state.currentMockInterview,
    currentQuestion: (state) => {
      if (state.currentMockInterview) {
        return state.currentMockInterview.questions[state.currentMockInterview.currentQuestionIndex];
      }
      return null;
    },
    isInterviewComplete: (state) => {
      if (state.currentMockInterview) {
        return state.currentMockInterview.currentQuestionIndex >= state.currentMockInterview.questions.length;
      }
      return false;
    },
    currentUsage: (state) => state.usageCheck?.value,
    isUsageLoading: (state) => state.usageCheck?.isLoading ?? false,
    usageError: (state) => state.usageCheck?.message,
    canUseInterview: (state) => state.usageCheck?.value?.canUse ?? false,
  },

  persist: {
    paths: ['currentMockInterview'],
    storage: persistedState.localStorage,
    debug: import.meta.env.MODE === 'development',
  },
});