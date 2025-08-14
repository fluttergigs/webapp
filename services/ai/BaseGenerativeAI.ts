/**
 * Base contract for generative AI implementations.
 */
export abstract class BaseGenerativeAI {
  /**
   * Generates a text completion from a given prompt.
   *
   * @param prompt - Text prompt to send to the model.
   */
  public abstract generateText<TResponse>(prompt: string): Promise<TResponse>;

  /**
   * Generates an image from a given prompt.
   *
   * @param prompt - Text prompt to send to the model.
   */
  public abstract generateImage<TResponse>(prompt: string): Promise<TResponse>;
}
