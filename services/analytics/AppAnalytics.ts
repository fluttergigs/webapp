import { AnalyticsEvent } from '~/services/analytics/events';

export abstract class AppAnalytics {

  abstract captureEvent(event: AnalyticsEvent, properties?: any): void;

  abstract identifyUser(identifier: string, properties?: any): void;

  abstract reset(): void;
}