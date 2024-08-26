import {AppAnalyticsProvider} from "~/services/analytics/app_analytics_provider";

export default defineNuxtPlugin(({vueApp}) => {
    const appAnalyticsProvider = new AppAnalyticsProvider();

    return {
        provide: {
            analytics: appAnalyticsProvider
        }
    };
});