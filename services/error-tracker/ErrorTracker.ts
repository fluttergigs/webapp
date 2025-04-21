export interface User {
  [key: string]: any;
}

export interface Context {
  [key: string]: any;
}

export abstract class ErrorTracker {
  abstract captureException(exception: any, context?: Context): void;

  abstract captureMessage(message: string, context?: Context): void;

  abstract setUser(user: User | null): void;
}
