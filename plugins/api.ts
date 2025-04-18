import { Fetcher } from '~/core/network/fetcher';

export default defineNuxtPlugin((nuxtApp) => {
  return ({
    provide: {
      http: new Fetcher(),
    },
  });
});