export abstract class GenerativeAI {
  public abstract generateText<TResponse>(prompt: string): Promise<any>;

  public abstract generateImage<IResponse>(prompt: string): Promise<any>;
}
