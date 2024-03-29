import {defineStore} from "pinia";
import {Endpoint} from "~/core/network/endpoints";
import {Wrapper} from "~/core/wrapper";
import {logDev} from "~/core/helpers/log";
import {
    Company,
    CreateCompanyRequest,
    ListCompanyApiResponse,
    UpdateCompanyRequest
} from "~/features/companies/company.types";
import {CallbackFunction, MultiApiResponse, SingleApiResponse} from "~/core/shared/types";
import {AppStrings} from "~/core/strings";
import {useAuthStore} from "~/stores/auth";
import type {HttpClient} from "~/core/network/http_client";
//@ts-ignore
import slugify from "@sindresorhus/slugify";
import {JobOffer, JobOfferApiResponse} from "~/features/jobs/job.types";
import {stringify} from "qs";

//@ts-ignore
import isBefore from "date-fns/isBefore";
//@ts-ignore
import isAfter from "date-fns/isAfter";
//@ts-ignore
import isSameDay from "date-fns/isSameDay";
//@ts-ignore
import parseISO from "date-fns/parseISO"
import {useUserStore} from "~/stores/user";
import {GenerativeAIProvider} from "~/services/ai/generative_ai_provider";

// @ts-ignore
export const useCompanyStore = defineStore('company', {
    state: () => ({
        companyListResponse: new Wrapper<ListCompanyApiResponse>().toInitial(),
        selectedCompany: Wrapper.getEmpty().toInitial(),
        companyCreation: new Wrapper<SingleApiResponse<Company>>().toInitial(),
        companyUpdate: new Wrapper<SingleApiResponse<Company>>().toInitial(),
        companyJobsResponse: new Wrapper<MultiApiResponse<JobOffer>>().toInitial(),
        isCompanyDescriptionGenerationModalOpen: false,
        companyDescriptionGenerationTask: new Wrapper<String>().toInitial(),

    }),
    actions: {
        hideCompanyDescriptionGenerationModal() {
            this.isCompanyDescriptionGenerationModalOpen = false;
        },
        showCompanyDescriptionGenerationModal() {
            this.isCompanyDescriptionGenerationModalOpen = true;
        },
        async generateCompanyDescription(prompt: string) {
            this.companyDescriptionGenerationTask = new Wrapper<String>().toLoading()
            try {
                //@ts-ignore
                const {$generativeAI} = useNuxtApp();
                const response: String = await (<GenerativeAIProvider>$generativeAI).generateText(prompt);
                //@ts-ignore
                this.companyDescriptionGenerationTask = this.companyDescriptionGenerationTask.toSuccess(response as String, AppStrings.companyDescriptionIsReady)
            } catch (e) {
                this.companyDescriptionGenerationTask = this.companyDescriptionGenerationTask.toFailed(AppStrings.unableToGenerateCompanyDescription)
                throw e;
            }
        },
        async fetchMyJobs() {
            try {
                const query = stringify({
                    populate: '*',
                    filters: {
                        company: {
                            id: {
                                $eq: useUserStore().myCompany?.id,
                            }
                        }
                    },
                    sort: 'createdAt:desc',
                }, {
                    encodeValuesOnly: true,
                })
                this.companyJobsResponse = new Wrapper<MultiApiResponse<JobOffer>>().toLoading()
                const {$http} = useNuxtApp()
                const response = await (<HttpClient>$http).get(`${Endpoint.jobOffers}?${query}`)
                // @ts-ignore
                this.companyJobsResponse = this.companyJobsResponse.toSuccess(response)
            } catch (e) {
                this.companyJobsResponse = this.companyJobsResponse.toFailed(AppStrings.unableToFetchJobs)
            }

        },
        async fetchCompanies(): Promise<void> {
            try {
                // @ts-ignore
                this.companyListResponse = new Wrapper<ListCompanyApiResponse>().toLoading()
                const {$http} = useNuxtApp()
                const response = await (<HttpClient>$http).get(`${Endpoint.companies}?populate=*`)
                // @ts-ignore
                this.companyListResponse = this.companyListResponse.toSuccess(response)
            } catch (e) {
                logDev('fetching companies error', e)
                this.companyListResponse = this.companyListResponse.toFailed(AppStrings.unableToFetchCompanies)
            }
        },

        async createCompany(payload: CreateCompanyRequest): Promise<void> {
            try {
                //@ts-ignore
                payload.data.slug = slugify(useAuthStore().authUser?.username + payload.data.name)
                this.companyCreation = new Wrapper<SingleApiResponse<Company>>().toLoading()
                const {$http} = useNuxtApp()
                const response = await (<HttpClient>$http).post(`${Endpoint.companies}`, payload)
                //@ts-ignore
                this.companyCreation = this.companyCreation.toSuccess(response, AppStrings.yourCompanyHasBeenCreatedSuccessfully.replaceAll('{{name}}', payload.data.name))
                // logDev('COMPANY RESPONSE', response)
            } catch (e) {
                //@ts-ignore
                this.companyCreation = this.companyCreation.toFailed(AppStrings.unableToCreateCompany.replaceAll('{{name}}', payload.data.name))
                throw e
            }
        },

        async updateCompany(payload: UpdateCompanyRequest): Promise<void> {
            try {
                //@ts-ignore
                this.companyUpdate = new Wrapper<SingleApiResponse<Company>>().toLoading()
                const {$http} = useNuxtApp()
                const response = await (<HttpClient>$http).put(`${Endpoint.companies}/${useUserStore().myCompany?.id}`, payload)
                //@ts-ignore
                this.companyUpdate = this.companyUpdate.toSuccess(response, AppStrings.yourCompanyHasBeenUpdatedSuccessfully.replaceAll('{{name}}', payload.data.name))
                // logDev('COMPANY RESPONSE', response)
            } catch (e) {
                //@ts-ignore
                this.companyUpdate = this.companyUpdate.toFailed(AppStrings.unableToUpdateCompany.replaceAll('{{name}}', payload.data.name))
                throw e
            }
        },

        async findCompanyById(id: string): Promise<void> {
            try {
                //@ts-ignore
                this.selectedCompany = new Wrapper().toLoading()
                const {$http} = useNuxtApp()
                const response = await (<HttpClient>$http).get(`${Endpoint.companies}/$id?populate[0]=jobOffers`)
                //@ts-ignore
                this.selectedCompany = this.selectedCompany.toSuccess(response)
                logDev('COMPANY RESPONSE', response)
            } catch (e) {
                this.selectedCompany = this.selectedCompany.toFailed(AppStrings.unableToFetchCompany)
            }
        }
    },
    getters: {
        //@ts-ignore
        companies: (state) => state.companyListResponse?.value?.data?.map((item: { [x: string]: any; }) => ({
            ...item['attributes'],
            id: item['id']
        })),
        myJobPostings: (state) => state.companyJobsResponse?.value?.data?.map((item: { [x: string]: any; }) => ({
            ...item['attributes'],
            id: item['id']
        })),
        expiredJobPostings: state => useCompanyStore().myJobPostings?.filter((job: JobOffer) => isBefore(parseISO(job.applyBefore), new Date())),
        activeJobPostings: state => useCompanyStore().myJobPostings?.filter((job: JobOffer) => isAfter(parseISO(job.applyBefore), new Date())),
    },
    // persist: true,
})