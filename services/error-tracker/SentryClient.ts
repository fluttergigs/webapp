// @ts-ignore
// @ts-ignore
import * as Sentry from '@sentry/nuxt';
import type { User } from '~/services/error-tracker/ErrorTracker';
import { Context, ErrorTracker } from '~/services/error-tracker/ErrorTracker';





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
