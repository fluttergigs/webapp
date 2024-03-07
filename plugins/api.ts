import {Fetcher} from "~/core/network/fetcher";

export default defineNuxtPlugin((nuxtApp) => {

    /*nuxtApp.hook('page:start', () => {

        logDev('FETCHING SETTINGS')
        useSettingStore().fetchSetting()
    });
*/
    return ({
        provide: {
            http: new Fetcher()
        }
    });
})