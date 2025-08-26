import { defineStore } from 'pinia';
import { Wrapper } from '~/core/wrapper';
import { logDev } from '~/core/helpers/log';
import { AppStrings } from '~/core/strings';
import type {
  MockInterviewRequest,
  MockInterviewResponse,
  MockInterviewSession,
} from '~/features/mockInterview/mockInterview.types';
import { GenerativeAIProvider } from '~/services/ai/GenerativeAIProvider';

export const useMockInterviewStore = defineStore('mockInterview', {
  state: () => ({
    mockInterviewGeneration: new Wrapper<MockInterviewResponse>().toInitial(),
    currentMockInterview: null as MockInterviewSession | null,
  }),

  actions: {
    async generateMockInterview(request: MockInterviewRequest) {
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
  },

  persist: {
    paths: ['currentMockInterview'],
    storage: persistedState.localStorage,
    debug: import.meta.env.MODE === 'development',
  },
});