abstract class HttpClient<Response> {

    abstract get(url: String): Promise<Response>;

    abstract post(url: String, payload: Record<string, any>, config?: Record<any, any>): Promise<Response>;

    abstract put(url: String, payload: Record<string, any>, config?: Record<any, any>): Promise<Response>;

    abstract delete(url: String, config?: Record<any, any>): Promise<Response>;

}