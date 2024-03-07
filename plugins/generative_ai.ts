import {GenerativeAIProvider} from "~/services/ai/generative_ai_provider";

export default defineNuxtPlugin(({vueApp}) => {
    const generativeAIProvider: GenerativeAIProvider = new GenerativeAIProvider();

    return {
        provide: {
            generativeAI: generativeAIProvider
        }
    };
});