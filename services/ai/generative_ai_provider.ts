import type {BaseGenerativeAI} from "~/services/ai/base_generative_ai";
import {GoogleGenerativeAIImpl} from "~/services/ai/google_generative_ai_impl";

export class GenerativeAIProvider {

    private client: BaseGenerativeAI;

    constructor() {
        this.client = new GoogleGenerativeAIImpl();
    }

    setClient(client: BaseGenerativeAI) {
        this.client = client;
        return this.client;
    }

    async generateText<String>(prompt: string): Promise<String> {
        return await this.client.generateText(prompt)
    }
}