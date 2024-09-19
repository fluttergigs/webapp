export interface BasicApiResponse<T = unknown> {
    data: T,

    [key: string]: any,

    error: {
        message: string,
        code: string,
        status: number,
        [key: string]: any
    }
}

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
    [key: string]: any,
}

export declare type CallbackFunction<Result, Err extends any> = ((val?: Result) => void) | ((err?: Err) => void);