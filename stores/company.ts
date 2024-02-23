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
import {SingleApiResponse} from "~/core/shared/types";
import {AppStrings} from "~/core/strings";
import {useAuthStore} from "~/stores/auth";

// @ts-ignore
export const useCompanyStore = defineStore('company', {
    state: () => ({
        companyListResponse: new Wrapper<ListCompanyApiResponse>().toInitial(),
        selectedCompany: Wrapper.getEmpty().toInitial(),
        companyCreation: new Wrapper<SingleApiResponse<Company>>().toInitial(),
        companyUpdate: new Wrapper<SingleApiResponse<Company>>().toInitial(),
    }),
    actions: {
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
                this.companyCreation = new Wrapper().toLoading()
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
                const response = await (<HttpClient>$http).put(`${Endpoint.companies}/${useAuthStore().myCompany.id}`, payload)
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
        companies: (state) => state.companyListResponse._value.data.map((item: { [x: string]: any; }) => ({
            ...item['attributes'],
            id: item['id']
        })),
    },
    // persist: true,
})