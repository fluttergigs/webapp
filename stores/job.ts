import { defineStore } from 'pinia';
// @ts-ignore
import { Endpoint } from '~/core/network/endpoints';
import { Wrapper } from '~/core/wrapper';
import { logDev } from '~/core/helpers/log';
import type { MultiApiResponse, SingleApiResponse } from '~/core/shared/types';
import { AppStrings } from '~/core/strings';
import type {
  JobCreationRequest,
  JobOffer,
  JobOfferApiResponse,
  JobOfferDeleteRequest,
  JobOfferEditRequest,
  JobSearchFilters,
  MockInterviewRequest,
  MockInterviewResponse,
  MockInterviewSession,
} from '~/features/jobs/job.types';
import type { HttpClient } from '~/core/network/http_client';
import { stringify } from 'qs';
import { MAX_LANDING_PAGE_JOBS, remoteOptions, seniorityLevelOptions, workTypeOptions } from '~/core/constants';
import { GenerativeAIProvider } from '~/services/ai/GenerativeAIProvider';

// @ts-ignore
export const useJobStore = defineStore('job', {
  state: () => ({
    jobListResponse: new Wrapper<MultiApiResponse<JobOffer>>().toInitial(),
    selectedJob: Wrapper.getEmpty().toInitial(),
    jobCreation: new Wrapper<SingleApiResponse<JobOffer>>().toInitial(),
    jobFiltersResponse: new Wrapper<MultiApiResponse<JobOffer>>().toInitial(),
    searchFilters: <JobSearchFilters>{},
    isJobDescriptionGenerationModalOpen: false,
    jobDescriptionGenerationTask: new Wrapper<String>().toInitial(),
    jobDelete: new Wrapper<SingleApiResponse<Object>>().toInitial(),
    jobEdit: new Wrapper<SingleApiResponse<Object>>().toInitial(),
    jobCreationData: <JobCreationRequest>{
      applyBefore: new Date(),
      workType: workTypeOptions[0].id,
      seniorityLevel: seniorityLevelOptions[0].id,
      remoteOptions: remoteOptions[0].id,
      company: useUserStore()?.myCompany?.id,
      hasPaid: false,
    },
    jobEditData: <JobOfferEditRequest>{},
    // Mock Interview state
    mockInterviewGeneration: new Wrapper<MockInterviewResponse>().toInitial(),
    currentMockInterview: null as MockInterviewSession | null,
  }),

  actions: {
    async generateJobDescription(prompt: string) {
      this.jobDescriptionGenerationTask = new Wrapper<String>().toLoading();
      try {
        //@ts-ignore
        const { $generativeAI } = useNuxtApp();
        const response = await (<GenerativeAIProvider>$generativeAI).generateText(prompt);
        this.jobCreationData.description = response as string;
        //@ts-ignore
        this.jobDescriptionGenerationTask = this.jobDescriptionGenerationTask.toSuccess(response as String, AppStrings.jobDescriptionIsReady);
      } catch (e) {
        this.jobDescriptionGenerationTask = this.jobDescriptionGenerationTask.toFailed(AppStrings.unableToGenerateJobDescription);
        throw e;
      }
    },
    hideJobDescriptionGenerationModal() {
      this.isJobDescriptionGenerationModalOpen = false;
    },
    showJobDescriptionGenerationModal() {
      this.isJobDescriptionGenerationModalOpen = true;
    },
    async setJobSearchFilters(filters: JobSearchFilters) {
      this.searchFilters = {
        ...this.searchFilters,
        ...filters,
      };
    },
    setJobCreationData(data: JobCreationRequest) {
      this.jobCreationData = {
        ...this.jobCreationData,
        ...data,
      };
    },
    setJobEditData(data: JobOfferEditRequest) {
      this.jobEditData = {
        ...this.jobEditData,
        ...data,
      };
    },
    clearJobEditData() {
      this.jobEditData = <JobOfferEditRequest>{};
    },

    async postJob() {
      this.jobCreation = new Wrapper<JobOfferApiResponse>().toLoading();
      try {
        //@ts-ignore
        const { $http } = useNuxtApp();
        /* //@ts-ignore
         this.jobCreationData.slug = generateJobOfferSlug({
             jobTitle: this.jobCreationData.title,
             companyName: useUserStore().myCompany.name
         })*/
        this.jobCreationData.company = useUserStore()?.myCompany?.id;

        const response = await (<HttpClient>$http).post<JobOfferApiResponse>(`${Endpoint.jobOffers}`, { data: this.jobCreationData });
        this.jobCreation = this.jobCreation.toSuccess(response, AppStrings.jobOfferPostedSuccessfully.replaceAll('{{title}}', <string>this.jobCreationData.title));
        //TODO - think more on that
        this.resetJobCreationData();
      } catch (e) {
        logDev('create company error', e);
        this.jobCreation = this.jobCreation.toFailed(AppStrings.unableToCreateJobOffer);
      }
    },

    async fetchJobs(): Promise<void> {
      this.jobListResponse = this.jobFiltersResponse = new Wrapper<MultiApiResponse<JobOffer>>().toLoading();
      try {
        // @ts-ignore
        const { $http } = useNuxtApp();
        const response = await (<HttpClient>$http).get(`${Endpoint.jobOffers}?populate=*`);
        // @ts-ignore
        this.jobListResponse = this.jobFiltersResponse = this.jobListResponse.toSuccess(response);
      } catch (e) {
        logDev('fetching job offers error', e);
        this.jobListResponse = this.jobFiltersResponse = this.jobListResponse.toFailed(AppStrings.unableToFetchJobs);
      }
    },

    async filterJobs(): Promise<void> {
      this.jobFiltersResponse = new Wrapper<MultiApiResponse<JobOffer>>().toLoading(this.jobFiltersResponse.value);
      try {
        const query = stringify({
          populate: '*',
          filters: {
            ...(!!this.searchFilters.remoteOption && {
              remoteOptions: {
                $eq: this.searchFilters.remoteOption,
              },
            }),
            ...(!!this.searchFilters.seniorityLevel && {
              seniorityLevel: {
                $eq: this.searchFilters.seniorityLevel,
              },
            }),
            ...(!!this.searchFilters.workType && {
              workType: {
                $eq: this.searchFilters.workType,
              },
            }),
            ...(!!this.searchFilters.keyword && {
              description: {
                $containsi: this.searchFilters.keyword,
              },
              name: {
                $containsi: this.searchFilters.keyword,
              },
            }),
            ...(!!this.searchFilters.countries && {
              workPermits: {
                $containsi: this.searchFilters.countries,
              },
            }),
          },
          sort: 'createdAt:desc',
        }, {
          encodeValuesOnly: true,
        });
        //@ts-ignore
        const { $http } = useNuxtApp();
        const response = await (<HttpClient>$http).get(`${Endpoint.jobOffers}?${query}`);
        // @ts-ignore
        this.jobFiltersResponse = this.jobFiltersResponse.toSuccess(response);
      } catch (e) {
        this.jobFiltersResponse = this.jobFiltersResponse.toFailed(AppStrings.unableToFetchJobs);
      }
    },
    async editJobOffer(job: JobOffer) {
      this.jobEdit = new Wrapper<SingleApiResponse<Object>>().toLoading();
      try {
        const { $http } = useNuxtApp();
        const response = await (<HttpClient>$http).put<SingleApiResponse<Object>>(`${Endpoint.jobOffers}/${job.documentId}`, { data: this.jobEditData });
        this.jobEdit = this.jobEdit.toSuccess(response, AppStrings.jobOfferUpdatedSuccessfully);
      } catch (e) {
        logDev('job offer edit error', e);
        this.jobEdit = this.jobCreation.toFailed(AppStrings.unableToEditJobOffer);
      }
    },

    async deleteJob(request: JobOfferDeleteRequest) {
      this.jobDelete = new Wrapper<SingleApiResponse<Object>>().toLoading();
      try {
        const { $http } = useNuxtApp();
        const response = await (<HttpClient>$http).delete<SingleApiResponse<Object>>(`${Endpoint.jobOffers}/${request.jobOffer}`);

        this.jobDelete = this.jobDelete.toSuccess(response, AppStrings.jobOfferDeletedSuccessfully);

      } catch (e) {
        logDev('delete company error', e);

        this.jobDelete = this.jobDelete.toFailed(AppStrings.unableToDeleteJobOffer);
      }
    },

    async setSelectedJob(job: JobOffer) {
      logDev('SETTING VIEWED JOB');
      //@ts-ignore
      this.selectedJob = new Wrapper().toSuccess(job);
      logDev('SETTING VIEWED JOB -- DONE');
    },

    async findJobById(job: JobOffer): Promise<void> {
      this.selectedJob = new Wrapper().toLoading(job);
      try {
        //@ts-ignore
        const { $http } = useNuxtApp();
        const response = await (<HttpClient>$http).get(`${Endpoint.jobOffers}/${job.id}?populate=*`);
        //@ts-ignore
        this.selectedJob = this.selectedJob.toSuccess(response);
        logDev('single Job RESPONSE', response);
      } catch (e) {
        //@ts-ignore
        this.selectedJob = this.selectedJob.toSuccess(job, AppStrings.unableToFetchJob);
      }
    },
    resetJobCreationData() {
      this.jobCreationData = <JobCreationRequest>{
        applyBefore: new Date(),
        workType: workTypeOptions[0].id,
        seniorityLevel: seniorityLevelOptions[0].id,
        remoteOptions: remoteOptions[0].id,
      };
    },

    // Mock Interview Actions
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

        try {
          parsedResponse = JSON.parse(response as string);
        } catch (parseError) {
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
    //@ts-ignore
    jobs: (state) =>
      state.jobListResponse?.value?.data ?? [],
    currentViewedJob: (state) => state.selectedJob.value,
    filteredJobs: (state) => (state.jobFiltersResponse?.value?.data ?? []).reverse(),
    landingPageJobs: (state) => {
      //@ts-ignore
      const jobs = (useJobStore().jobs.reverse()) as JobOffer[];
      return jobs?.length > MAX_LANDING_PAGE_JOBS ? jobs?.slice(0, MAX_LANDING_PAGE_JOBS - 1) : jobs;
    },
    // Mock Interview getters
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
  // persist: true,
  persist:
    {
      paths: ['selectedJob', 'jobEditData', 'jobCreationData', 'currentMockInterview'],
      storage: persistedState.localStorage,
      debug: import.meta.env.MODE === 'development',
    },
});