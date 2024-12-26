//@ts-ignore
import { FetchOptions } from "ofetch";
import { $fetchInterceptor } from "~/core/network/interceptor";
import type { HttpClient } from "~/core/network/http_client";
import { HttpMethod } from "~/core/network/http_client";

const headers = {
  Accept: "*/*",
  "Access-Control-Allow-Methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Credentials": "true",
  "Access-Control-Allow-Headers": "*",
  "Access-Control-Expose-Headers": "*",
};
//@ts-ignore
export type Response<T = any> = { data: T; [key: string] };

export class Fetcher implements HttpClient<Response> {
  readonly baseURL;
  private readonly instance;

  constructor(private readonly fetchOptions?: FetchOptions) {
    this.baseURL =
      useRuntimeConfig().apiBaseUrl ?? useRuntimeConfig().public.apiBaseUrl;
    // @ts-ignore
    const apiFetchOptions: FetchOptions = {
      baseURL: this.baseURL,
      headers,
      ...$fetchInterceptor,
      signal: new AbortController().signal,
      // mode: "cors"
    };

    this.fetchOptions = fetchOptions ?? apiFetchOptions;

    this.instance = $fetch.create(this.fetchOptions);
  }

  async delete(url: String, config?: Record<any, any>): Promise<Response> {
    return await this.instance(this.baseURL + url, {
      method: HttpMethod.DELETE,
      ...config,
    });
  }

  async get(url: String, config?: Record<any, any>): Promise<Response> {
    // logDev('BASE URL GET',useRuntimeConfig().public.apiBaseUrl)
    return await this.instance(this.baseURL + url, {
      method: HttpMethod.GET,
      ...config,
    });
  }

  async post(
    url: String,
    payload: Record<string, any>,
    config?: Record<any, any>
  ): Promise<Response> {
    return await this.instance(this.baseURL + url, {
      method: HttpMethod.POST,
      body: payload,
      ...config,
    });
  }

  async put(
    url: String,
    payload: Record<string, any>,
    config?: Record<any, any>
  ): Promise<Response> {
    return await this.instance(this.baseURL + url, {
      method: HttpMethod.PUT,
      body: payload,
      ...config,
    });
  }
}
