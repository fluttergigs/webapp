import {AppAnalytics} from "~/services/analytics/app_analytics";
import {PosthogClient} from "~/services/analytics/posthog_client";
import {AnalyticsEvent} from "~/services/analytics/events";
import {logDev} from "~/core/helpers/log";

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

    /**
     * Captures an event
     * @param event
     * @param properties
     */
    capture(event: AnalyticsEvent, properties: any = {}) {
        logDev(`[Analytics] ${event} ${properties?.toString()}`);
        this.client.captureEvent(event, properties ?? {});

        return this.client;
    }

    /**
     * Identify the user
     * @param identifier
     * @param properties
     */
    identify(identifier: string, properties: Object = {}) {
        this.client.identifyUser(identifier, properties);
        return this.client;
    }

}