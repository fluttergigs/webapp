//@ts-ignore
import type {
  StrapiForgotPasswordData,
  StrapiResetPasswordData,
} from '@nuxtjs/strapi/dist/runtime/types';
import { AuthService } from '~/services/auth/auth.base.service';
import { LoginData, RegistrationData } from '~/services/auth/auth.types';

export class AuthProvider {
  private authService: AuthService<LoginData, RegistrationData>;

  constructor(service: AuthService<LoginData, RegistrationData>) {
    this.authService = service;
  }

  setClient(authService: AuthService<LoginData, RegistrationData>) {
    this.authService = authService;
  }

  async login(data: LoginData) {
    return this.authService.login(data);
  }

  async register(data: RegistrationData) {
    return this.authService.register(data);
  }

  async logout() {
    await this.authService.logout();
  }

  async fetchUser() {
    return this.authService.fetchUser();
  }

  async resetPassword<T>(data: T) {
    await this.authService.resetPassword<T>(data);
  }

  async forgotPassword<T>(data: T) {
    await this.authService.forgotPassword<T>(data);
  }
}
