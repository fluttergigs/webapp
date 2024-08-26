import type {User} from "~/services/error-tracker/error_tracker";
import {Context, ErrorTracker} from "~/services/error-tracker/error_tracker";
// @ts-ignore
import * as Sentry from "@sentry/nuxt";


export class SentryClient implements ErrorTracker {

    captureException(error: Error, context?: Context): void {
        Sentry.captureException(error, context);
    }

    captureMessage(message: string, context?: Context): void {
        Sentry.captureMessage(message, context);
    }

    setUser(user: User | null): void {
        Sentry.setUser(user);
    }

}