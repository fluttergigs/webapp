import type {User} from "~/services/error-tracker/error_tracker";
import {Context, ErrorTracker} from "~/services/error-tracker/error_tracker";
import {SentryClient} from "~/services/error-tracker/sentry_client";

export class ErrorTrackerProvider {
    private client: ErrorTracker;

    constructor() {
        this.client = new SentryClient();
    }

    setClient(client: ErrorTracker): ErrorTracker {
        this.client = client;
        return this.client;
    }

    /**
     * Captures an event
     * @param message
     * @param context
     */
    captureMessage(message: string, context?: Context) {
        this.client.captureMessage(message, context);
        return this.client;
    }

    /**
     * Captures an event
     * @param exception
     * @param context
     */
    captureException(exception: Error, context?: Context) {
        this.client.captureException(exception, context);
        return this.client;
    }

    /**
     * Identify the user
     * @param user
     */
    setUser(user: User) {
        this.client.setUser(user);
        return this.client;
    }
}