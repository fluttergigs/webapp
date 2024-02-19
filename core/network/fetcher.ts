import {String} from "postcss-selector-parser";
import {FetchOptions} from "ofetch";
import {$fetchInterceptor} from "~/core/network/interceptor";


const headers = {
    "Accept": "*/*",
    "Access-Control-Allow-Methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Allow-Headers": "*",
    "Access-Control-Expose-Headers": "*",
};

//@ts-ignore


type Response = { data, [key: string] }


export class Fetcher implements HttpClient<Response> {

    private readonly instance;

    readonly baseURL;

    private readonly fetchOptions: FetchOptions

    constructor(fetchOptions?: FetchOptions) {
        this.baseURL = useRuntimeConfig().public.apiBaseUrl ?? useRuntimeConfig().apiBaseUrl;

        // @ts-ignore
        const apiFetchOptions: FetchOptions = {
            baseURL: this.baseURL,
            headers,
            ...$fetchInterceptor,
            signal: new AbortController().signal,
            // mode: "cors"
        };

        this.fetchOptions = fetchOptions ?? apiFetchOptions

        this.instance = $fetch.create(this.fetchOptions);
    }

    async delete(url: String, config?: Record<any, any>) {

        return await this.instance(this.baseURL + url, {
            method: 'delete',
            ...config
        });
    }

    async get(url: String, config?: Record<any, any>): Promise<Response> {
        // logDev('BASE URL GET',useRuntimeConfig().public.apiBaseUrl)
        return await this.instance(this.baseURL + url, {
            method: 'get',
            ...config,
        });
    }

    async post(url: String, payload: Record<string, any>, config?: Record<any, any>): Promise<Response> {
        return await this.instance(this.baseURL + url, {
            method: 'post',
            body: payload,
            ...config
        });
    }

    async put(url: String, payload: Record<string, any>, config?: Record<any, any>): Promise<Response> {
        return await this.instance(this.baseURL + url, {
            method: 'put',
            body: payload,
            ...config,
        });
    }

}