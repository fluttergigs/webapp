import {
  StrapiAuthenticationData,
  StrapiForgotPasswordData,
  StrapiRegistrationData,
  StrapiResetPasswordData,
} from '@nuxtjs/strapi/dist/runtime/types';
import { Endpoint } from '~/core/network/endpoints';
import type { HttpClient } from '~/core/network/http_client';
import { AuthService } from '~/services/auth/auth.base.service';

export class AuthStrapiClient
  implements
    AuthService<
      StrapiAuthenticationData,
      StrapiRegistrationData,
      StrapiResetPasswordData,
      StrapiForgotPasswordData
    >
{
  private strapiAuth = useStrapiAuth();

  async login(data: StrapiAuthenticationData): Promise<any> {
    return this.strapiAuth.login(data);
  }

  async logout(): Promise<void> {
    this.strapiAuth.logout();
  }

  async register(data: StrapiRegistrationData): Promise<any> {
    return this.strapiAuth.register(data);
  }

  async resetPassword(data: StrapiResetPasswordData): Promise<any> {
    return this.strapiAuth.resetPassword(data);
  }

  async forgotPassword(data: StrapiForgotPasswordData): Promise<any> {
    return this.strapiAuth.forgotPassword(data);
  }

  async fetchUser(): Promise<any> {
    return (useNuxtApp().$http as HttpClient).get(`${Endpoint.getMe}?populate=*`);
  }
}
