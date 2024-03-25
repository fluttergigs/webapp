export interface SingleApiResponse<T> {
    [key: string]: unknown,

    data: {
        id: unknown,
        attributes: T
    }
}

export interface MultiApiResponse<T> {
    data: {
        id: unknown,
        attributes: T
    }[]
}

export enum Direction {
    vertical = "vertical",
    horizontal = "horizontal"
}

export declare type Country = {
    name: string,
    flag: {
        src: string,
        ico: string,
    },
    iso: string,
    [key:string]: any,
}

export declare type CallbackFunction<Result> = ((val?: Result) => void) | ((err?: Error) => void);