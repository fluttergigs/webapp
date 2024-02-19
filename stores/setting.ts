import {defineStore} from "pinia";
import {Endpoint} from "~/core/network/endpoints";
import {logDev} from "~/core/helpers/log";


export interface Setting {
    [key: string]: any,
}

export const useSettingStore = defineStore('setting', {
    state: (() => ({

        setting: <Record<any, any>>{}

    })),
    actions: {
        async fetchSetting() {
            const {$http} = useNuxtApp()

            const response = await $http.get(Endpoint.setting)
            this.setSetting(response)
        },
        setSetting(data: any) {
            this.setting = data.data.attributes.extras;
            logDev('SETTING', data)

        }
    },
    getters: {
        isMaintenanceMode: (state)=> state.setting['maintenanceMode'] ?? false

    },
    persist: true,
})