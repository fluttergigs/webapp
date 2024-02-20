import {defineStore} from "pinia";
import {Endpoint} from "~/core/network/endpoints";
import {Status, Wrapper} from "~/core/wrapper";
import {logDev} from "~/core/helpers/log";
import {Company, CreateCompanyRequest, ListCompanyApiResponse} from "~/features/companies/company.types";
import {PromiseVoid} from "~/core/network/interceptor";
import {useAuthStore} from "~/stores/auth";


export const useCompanyStore = defineStore('company', {
    state: () => ({
        companyListResponse: Wrapper<ListCompanyApiResponse>.getEmpty<ListCompanyApiResponse>().toInitial(),
        selectedCompany: Wrapper.getEmpty().toInitial(),
        companyCreation: Wrapper.getEmpty().toInitial(),
    }),
    actions: {
        async fetchCompanies(): PromiseVoid {
            try {
                this.companyListResponse = new Wrapper(null, Status.loading)
                const {$http} = useNuxtApp()
                const response = await $http.get(`${Endpoint.companies}?populate=*`)
                this.companyListResponse = this.companyListResponse.toSuccess(response)
                logDev('COMPANY RESPONSE', response)
            } catch (e) {
                logDev('fetching companies error', e)
                this.companyListResponse = this.companyListResponse.toFailed('Unable to fetch companies')
            }
        },

        async createCompany(payload: CreateCompanyRequest): PromiseVoid {
            try {
                this.companyCreation = new Wrapper(null, Status.loading)
                const {$http} = useNuxtApp()
                const response = await $http.post(`${Endpoint.companies}`, payload)
                this.companyCreation = this.selectedCompany.toSuccess(response)
                logDev('COMPANY RESPONSE', response)
            } catch (e) {
                this.companyCreation = this.companyCreation.toFailed(`Unable to create company with data: ${payload}`)
            }
        },

        async findCompanyById(id: string): PromiseVoid {
            try {
                this.selectedCompany = new Wrapper(null, Status.loading)
                const {$http} = useNuxtApp()
                const response = await $http.get(`${Endpoint.companies}/$id?populate[0]=jobOffers`)
                this.selectedCompany = this.selectedCompany.toSuccess(response)
                logDev('COMPANY RESPONSE', response)
            } catch (e) {
                this.selectedCompany = this.selectedCompany.toFailed(`Unable to fetch company with id: ${id}`)
            }
        }
    },
    getters: {
        companies: (state) => state['companyListResponse'].value.data.map((item) => ({
            ...item['attributes'],
            id: item['id']
        })),
        hasCompany: (state) => {
            const store = useCompanyStore()
            const authUser = useAuthStore().authUser

            return (store.companies as Company[]).filter((company) => company.user.data.id === authUser?.id ?? '') > 0
            // state.
        }
    },
    // persist: true,
})