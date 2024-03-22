export abstract class BaseGenerativeAI {

    public abstract generateText<TResponse>(prompt: string): Promise<any>;

    public abstract generateImage<IResponse>(prompt: string): Promise<any>
}