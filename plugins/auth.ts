//@ts-ignore
import {
  StrapiAuthenticationData,
  StrapiRegistrationData,
} from '@nuxtjs/strapi/dist/runtime/types';
import { AuthProvider } from '~/services/auth/AuthProvider';
import { AuthStrapiClient } from '~/services/auth/AuthStrapiClient';

export default defineNuxtPlugin((nuxtApp) => {
  // @ts-ignore
  const authProvider: AuthProvider = new AuthProvider(new AuthStrapiClient());

  return {
    provide: {
      auth: authProvider,
    },
  };
});
