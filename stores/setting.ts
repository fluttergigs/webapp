import { defineStore } from 'pinia';
import { logDev } from '~/core/helpers/log';
import { Endpoint } from '~/core/network/endpoints';
import type { HttpClient } from '~/core/network/http_client';
import type { SingleApiResponse } from '~/core/shared/types';
import { AppStrings } from '~/core/strings';
import { Wrapper } from '~/core/wrapper';

export interface Setting {
  extras: {
    [key: string]: any;
  };

  [key: string]: any;
}

//@ts-ignore
export const useSettingStore = defineStore('setting', {
  state: () => ({
    setting: new Wrapper<SingleApiResponse<Setting>>().toInitial(),
  }),
  actions: {
    async fetchSetting() {
      try {
        this.setting = new Wrapper<SingleApiResponse<Setting>>().toLoading();
        const { $http } = useNuxtApp();

        const response = await ($http as HttpClient).get(Endpoint.setting);
        this.setSetting(response);
      } catch (e) {
        logDev(e);
        this.setSetting({});
        this.setting = new Wrapper<SingleApiResponse<Setting>>().toFailed(
          AppStrings.unableToFetchSetting,
        );
      }
    },
    setSetting(response: any) {
      this.setting = new Wrapper<SingleApiResponse<Setting>>().toSuccess(response.data);
    },
  },
  getters: {
    getSettingExtras: (state) => state.setting.value.extras ?? {},
    getAppName: (state) => useSettingStore().getSettingExtras['appName'] ?? APP_NAME,
    isMaintenanceMode: (state) => useSettingStore().getSettingExtras['maintenanceMode'] ?? false,
  },
  persist: true,
});
