export abstract class HttpClient<Response = any> {

  abstract get<Response>(url: String): Promise<Response>;

  abstract post<Response>(url: String, payload: Record<string, any>, config?: Record<any, any>): Promise<Response>;

  abstract put<Response>(url: String, payload: Record<string, any>, config?: Record<any, any>): Promise<Response>;

  abstract delete<Response>(url: String, config?: Record<any, any>): Promise<Response>;
}

export enum HttpMethod {
  GET = 'get',
  POST = 'post',
  PUT = 'put',
  DELETE = 'delete',
  'PATCH' = 'patch'
}