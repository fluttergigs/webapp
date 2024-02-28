//@ts-ignore
import posthog from "posthog-js";
import {AppAnalytics} from "~/services/analytics/app_analytics";
import {AnalyticsEvent} from "~/services/analytics/events";

export class PosthogClient implements AppAnalytics {
    constructor() {
        try {
            const {public: {posthogKey}} = useRuntimeConfig();

            const posthogClient = posthog.init(posthogKey, {
                capture_pageleave: false,
                capture_pageview: false,
                name: "Flutter Gigs",
                debug: import.meta.env.MODE === "development",
                advanced_disable_decide: import.meta.env.MODE === "development",
                // api_host: "https://app.posthog.com",
                loaded: (posthog: any) => {
                    posthog.debug(import.meta.env.MODE === "development");
                }
            });

        } catch (e) {
            console.log(`error: ${e}`);
        }
    }

    captureEvent(event: AnalyticsEvent, properties?: any): void {
        posthog.capture(event, properties);
    }

    identifyUser(identifier: string, properties?: any): void {
        posthog.identify(identifier, properties);
    }

    reset(): void {
        posthog.reset();
    }
}