export interface BasicApiResponse<T = unknown> {
  data: T,
  error: {
    message: string,
    code: string,
    status: number,
    [key: string]: any
  }

  [key: string]: any,
}

export interface SingleApiResponse<T> {
  data: T,

  [key: string]: unknown,
}

export interface MultiApiResponse<T> {
  data: T[];
}

export enum Direction {
  vertical = 'vertical',
  horizontal = 'horizontal'
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

export enum PaymentContext {
  jobPost = 'jobPost',
}

export declare type CallbackFunction<Result, Err extends any = {}> = ((val?: Result) => void) | ((err?: Err) => void);