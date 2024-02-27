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
    vertical ="vertical",
    horizontal = "horizontal"
}