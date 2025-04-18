import type { GenerativeAI } from '~/services/ai/GenerativeAI';
import { GoogleGenerativeAIImpl } from '~/services/ai/GoogleGenerativeAIImpl';

export class GenerativeAIProvider {
  private client: GenerativeAI;

  constructor() {
    this.client = new GoogleGenerativeAIImpl();
  }

  setClient(client: GenerativeAI) {
    this.client = client;
    return this.client;
  }

  async generateText<String>(prompt: string): Promise<String> {
    return this.client.generateText(prompt);
  }
}
