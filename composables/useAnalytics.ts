import { ErrorTrackerProvider } from "~/services/error-tracker/error_tracker_provider";
import { AppAnalyticsProvider } from "~/services/analytics/app_analytics_provider";
import type { User } from "~/services/auth/auth.types";
import type { AnalyticsEvent } from "~/services/analytics/events";

export function useAnalytics() {
  const { $analytics, $errorTracker } = useNuxtApp();

  const identifyUser = async (data: User) => {
    (<ErrorTrackerProvider>$errorTracker).setUser(data);
    (<AppAnalyticsProvider>$analytics).identify(data?.email!, data);
  };

  const capture = async (event: AnalyticsEvent, data?: any) => {
    (<AppAnalyticsProvider>$analytics).capture(event, data);
  };

  return {
    identifyUser,
    capture,
  };
}
