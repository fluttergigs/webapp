import {AppAnalytics} from "~/services/analytics/app_analytics";
import {PosthogClient} from "~/services/analytics/posthog_client";
import {AnalyticsEvent} from "~/services/analytics/events";

export class AppAnalyticsProvider {
    private client: AppAnalytics;

    constructor() {
        this.client = new PosthogClient();
    }

    setClient(client: AppAnalytics) {
        this.client = client;
        return this.client;
    }

    reset() {
        this.client.reset();
    }

    capture(event: AnalyticsEvent, properties?: Object) {
        if (import.meta.env.MODE === "development") {
            this.client.captureEvent(event, properties);
        }
        return this.client;
    }

    identify(identifier: string, properties?: Object) {
        this.client.identifyUser(identifier, properties);
        return this.client;
    }

}