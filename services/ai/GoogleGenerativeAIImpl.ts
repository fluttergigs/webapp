//@ts-ignore
import { GoogleGenerativeAI } from '@google/generative-ai';
import { logDev } from '~/core/helpers/log';
import type { BaseGenerativeAI } from '~/services/ai/BaseGenerativeAI';

export class GoogleGenerativeAIImpl implements BaseGenerativeAI {
  private genAI: GoogleGenerativeAI;

  constructor() {
    const {
      public: { googleGenerativeApiKey },
    } = useRuntimeConfig();

    this.genAI = new GoogleGenerativeAI(googleGenerativeApiKey);
  }

  generateImage<TResponse>(prompt: string): Promise<TResponse> {
    return Promise.resolve(undefined as unknown as TResponse);
  }

  async generateText<TResponse>(prompt: string): Promise<TResponse> {
    // For text-only input, use the gemini-pro model
    const model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

    const result = await model.generateContent(prompt);
    const response = await result.response;

    logDev('RESPONSE', response);
    return response.text() as TResponse;
  }
}
