import type { BaseGenerativeAI } from '~/services/ai/BaseGenerativeAI';
import { GoogleGenerativeAIImpl } from '~/services/ai/GoogleGenerativeAIImpl';

export class GenerativeAIProvider {
  private client: BaseGenerativeAI;

  constructor() {
    this.client = new GoogleGenerativeAIImpl();
  }

  setClient(client: BaseGenerativeAI) {
    this.client = client;
    return this.client;
  }

  async generateText<TResponse>(prompt: string): Promise<TResponse> {
    return this.client.generateText<TResponse>(prompt);
  }

  async generateImage<TResponse>(prompt: string): Promise<TResponse> {
    return this.client.generateImage<TResponse>(prompt);
  }
}
