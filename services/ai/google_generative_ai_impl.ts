import type {BaseGenerativeAI} from "~/services/ai/base_generative_ai";
//@ts-ignore
import {GoogleGenerativeAI} from "@google/generative-ai";
import {logDev} from "~/core/helpers/log";


export class GoogleGenerativeAIImpl implements BaseGenerativeAI {

    private genAI: GoogleGenerativeAI;

    constructor() {
        const {public: {googleGenerativeAiApiKey}} = useRuntimeConfig();

        this.genAI = new GoogleGenerativeAI(googleGenerativeAiApiKey)
    }

    generateImage(prompt: string): Promise<any> {
        return Promise.resolve(undefined);
    }

    async generateText(prompt: string): Promise<any> {
        // For text-only input, use the gemini-pro model
        const model = this.genAI.getGenerativeModel({model: "gemini-pro"});

        const result = await model.generateContent(prompt);
        const response = await result.response;

        logDev('RESPONSE', response)
        return response.text();
    }

}