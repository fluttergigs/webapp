import type {
  StrapiAuthenticationData,
  StrapiForgotPasswordData,
  StrapiRegistrationData,
  StrapiResetPasswordData,
} from '@nuxtjs/strapi/dist/runtime/types';
import { AuthProvider } from '~/services/auth/AuthProvider';
import { AuthStrapiClient } from '~/services/auth/AuthStrapiClient';
import type { AuthService } from '~/services/auth/auth.base.service';

export default defineNuxtPlugin((nuxtApp) => {
  const authProvider: AuthProvider = new AuthProvider(
    new AuthStrapiClient() as AuthService<
      StrapiAuthenticationData,
      StrapiRegistrationData,
      StrapiResetPasswordData,
      StrapiForgotPasswordData
    >,
  );

  return {
    provide: {
      auth: authProvider,
    },
  };
});
