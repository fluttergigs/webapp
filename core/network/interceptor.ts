//@ts-ignore
import type { FetchContext, FetchResponse } from 'ofetch';
import { useAuthStore } from '~/stores/auth';
import { logDev } from '../helpers/log';

export type PromiseVoid = Promise<void> | void;
export const $fetchInterceptor = {
  async onRequest(context: FetchContext): Promise<void> {
    const { isAuthenticated, hasTokenExpired, logout, jwt } = useAuthStore();
    if (isAuthenticated) {
      if (hasTokenExpired) {
        // useNuxtApp().$abortController.abort();
        await logout();
      } else {
        //@ts-ignore

        if (typeof context.options.headers === 'object') {
          // For client-side
          if (context.options.headers instanceof Headers) {
            context.options.headers.set('Authorization', `Bearer ${jwt}`);
          }
          // For server-side or plain object
          else {
            context.options.headers = context.options.headers || {};
            //@ts-ignore
            context.options.headers['Authorization'] = `Bearer ${jwt}`;
          }
        }
      }
    }
  },
  onRequestError(context: FetchContext & { error: Error }): PromiseVoid {
    logDev('REQUEST ERROR', context.error);
  },
  async onResponse(
    context: FetchContext & { response: FetchResponse<ResponseType> },
  ): Promise<void> { },
};
