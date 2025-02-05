//@ts-ignore
import posthog from "posthog-js";
import {AppAnalytics} from "~/services/analytics/app_analytics";
import {AnalyticsEvent} from "~/services/analytics/events";
import {logDev} from "~/core/helpers/log";

export class PosthogClient implements AppAnalytics {
    constructor() {
        try {
            const {public: {posthogKey}} = useRuntimeConfig();

            const posthogClient = posthog.init(posthogKey, {
                capture_pageleave: true,
                capture_pageview: true,
                name: "Flutter Gigs",
                debug: import.meta.env.MODE === "development",
                advanced_disable_decide: import.meta.env.MODE === "development",
                person_profiles: 'always',
                api_host: "https://us.i.posthog.com",
                loaded: (posthog: any) => {
                    // posthog.debug(import.meta.env.MODE === "development");
                    posthog.debug(false);
                }
            });

        } catch (e) {
            console.log(`error: ${e}`);
        }
    }

    captureEvent(event: AnalyticsEvent, properties?: any): void {
        logDev(`[Analytics] ${event} ${properties?.toString()}`)

        // if (import.meta.env.MODE !== "development")
        posthog.capture(event, properties)
    }

    identifyUser(identifier: string, properties?: any): void {
        posthog.identify(identifier, properties);
    }

    reset(): void {
        posthog.reset();
    }
}