export interface User {
    [key: string]: any;
}

export interface Context {
    [key: string]: any;
}


export abstract class ErrorTracker {

    captureException(exception: any, context?: Context): void;

    captureMessage(message: string, context?: Context): void;

    setUser(user: User): void;
}