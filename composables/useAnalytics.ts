import {ErrorTrackerProvider} from "~/services/error-tracker/error_tracker_provider";
import {AppAnalyticsProvider} from "~/services/analytics/app_analytics_provider";
import type {User} from "~/services/auth/auth.types";

export function useAnalytics() {
    const {$analytics, $errorTracker} = useNuxtApp();

    const identifyUser = async (data: User) => {
        (<ErrorTrackerProvider>$errorTracker).setUser(data);
        (<AppAnalyticsProvider>$analytics).identify(data?.email!, data);
    };

    return {
        identifyUser,
    };
}
