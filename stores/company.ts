import {defineStore} from "pinia";
import {Endpoint} from "~/core/network/endpoints";
import {Wrapper} from "~/core/wrapper";
import {logDev} from "~/core/helpers/log";
import {Company, CreateCompanyRequest, ListCompanyApiResponse} from "~/features/companies/company.types";
import {SingleApiResponse} from "~/core/shared/types";


// @ts-ignore
export const useCompanyStore = defineStore('company', {
    state: () => ({
        companyListResponse: new Wrapper<ListCompanyApiResponse>().toInitial(),
        selectedCompany: Wrapper.getEmpty().toInitial(),
        companyCreation: new Wrapper<SingleApiResponse<Company>>().toInitial(),
    }),
    actions: {
        async fetchCompanies(): Promise<void> {
            try {
                // @ts-ignore
                this.companyListResponse = new Wrapper<ListCompanyApiResponse>().toLoading()
                const {$http} = useNuxtApp()
                const response = await $http.get(`${Endpoint.companies}?populate=*`)
                // @ts-ignore
                this.companyListResponse = this.companyListResponse.toSuccess(response)
            } catch (e) {
                logDev('fetching companies error', e)
                this.companyListResponse = this.companyListResponse.toFailed('Unable to fetch companies')
            }
        },

        async createCompany(payload: CreateCompanyRequest): Promise<void> {
            try {

                logDev('CREATE COMPANY REQUEST', payload)
                //@ts-ignore
                this.companyCreation = new Wrapper().toLoading()
                const {$http} = useNuxtApp()
                const response = await $http.post(`${Endpoint.companies}`, payload)
                //@ts-ignore
                this.companyCreation = this.companyCreation.toSuccess(response, `Your company ${payload.data.name} has been created successfully`)
                // logDev('COMPANY RESPONSE', response)
            } catch (e) {
                //@ts-ignore
                this.companyCreation = this.companyCreation.toFailed(`Unable to create company with data: ${payload.data.name}`)
                throw e
            }
        },

        async findCompanyById(id: string): Promise<void> {
            try {
                //@ts-ignore
                this.selectedCompany = new Wrapper().toLoading()
                const {$http} = useNuxtApp()
                const response = await $http.get(`${Endpoint.companies}/$id?populate[0]=jobOffers`)
                //@ts-ignore
                this.selectedCompany = this.selectedCompany.toSuccess(response)
                logDev('COMPANY RESPONSE', response)
            } catch (e) {
                this.selectedCompany = this.selectedCompany.toFailed(`Unable to fetch company with id: ${id}`)
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