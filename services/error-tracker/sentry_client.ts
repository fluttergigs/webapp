import {Context, ErrorTracker} from "~/services/error-tracker/error_tracker";
import {Sentry} from "@sentry/nuxt";
import {Models} from "appwrite";
import User = Models.User;

class SentryClient implements ErrorTracker {

    captureException(error: Error, context?: Context): void {
        Sentry.captureException(error, context);
    }

    captureMessage(message: string, context?: Context): void {
        Sentry.captureMessage(message, context);
    }

    setUser(user: User): void {
        Sentry.captureUser(user);
    }


}