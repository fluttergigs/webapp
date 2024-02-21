import {defineStore} from "pinia";
import {Endpoint} from "~/core/network/endpoints";
import {logDev} from "~/core/helpers/log";
import {SingleApiResponse} from "~/core/shared/types";

export interface Setting {
    [key: string]: any,
}

export const useSettingStore = defineStore('setting', {
    state: (() => ({
        setting: <SingleApiResponse<Setting>>{}
    })),
    actions: {
        async fetchSetting() {
            const {$http} = useNuxtApp()

            const response = await $http.get(Endpoint.setting)
            this.setSetting(response)
        },
        setSetting(data: any) {
            this.setting = data.data.attributes.extras;
        }
    },
    getters: {
        isMaintenanceMode: (state) => state['setting']['maintenanceMode'] ?? false
    },
    persist: true,
})