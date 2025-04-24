//@ts-ignore
import type { FetchOptions } from 'ofetch';
import type { HttpClient } from '~/core/network/http_client';
import { HttpMethod } from '~/core/network/http_client';
import { $fetchInterceptor } from '~/core/network/interceptor';

const baseHeaders = {
  Accept: '*/*',
  'Access-Control-Allow-Methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': 'true',
  'Access-Control-Allow-Headers': '*',
  'Access-Control-Expose-Headers': '*',
};
//@ts-ignore
export type Response<T = any> = { data: T; [key: string] };

export class Fetcher implements HttpClient<Response> {
  readonly baseURL;
  private readonly instance;

  constructor(private readonly fetchOptions?: FetchOptions) {
    this.baseURL = useRuntimeConfig().apiBaseUrl ?? useRuntimeConfig().public.apiBaseUrl;

    const controller = new AbortController();

    // @ts-ignore
    const apiFetchOptions: FetchOptions = {
      baseURL: this.baseURL,
      headers: baseHeaders,
      ...$fetchInterceptor,
      signal: controller.signal,
      // mode: "cors"
    };

    this.fetchOptions = {
      ...apiFetchOptions,
      ...fetchOptions,
    };

    this.instance = $fetch.create(this.fetchOptions);
  }

  async delete<Response>(url: String, config?: Record<any, any>): Promise<Response> {
    return await this.instance(this.baseURL + url, {
      method: HttpMethod.DELETE,
      ...config,
    });
  }

  async get<Response>(url: String, config?: Record<any, any>): Promise<Response> {
    // logDev('BASE URL GET',useRuntimeConfig().public.apiBaseUrl)
    return await this.instance(this.baseURL + url, {
      method: HttpMethod.GET,
      ...config,
    });
  }

  async post<Response>(
    url: String,
    payload: Record<string, any>,
    config?: Record<any, any>,
  ): Promise<Response> {
    return await this.instance(this.baseURL + url, {
      method: HttpMethod.POST,
      body: payload,
      ...config,
    });
  }

  async put<Response>(
    url: String,
    payload: Record<string, any>,
    config?: Record<any, any>,
  ): Promise<Response> {
    return await this.instance(this.baseURL + url, {
      method: HttpMethod.PUT,
      body: payload,
      ...config,
    });
  }
}
