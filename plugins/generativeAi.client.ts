import { GenerativeAIProvider } from '~/services/ai/GenerativeAIProvider';

export default defineNuxtPlugin(({ vueApp }) => {
  const generativeAIProvider: GenerativeAIProvider = new GenerativeAIProvider();

  return {
    provide: {
      generativeAI: generativeAIProvider,
    },
  };
});
