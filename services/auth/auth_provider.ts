import {AuthService} from "~/services/auth/auth.base.service";
import {LoginData, RegistrationData} from "~/services/auth/auth.types";
//@ts-ignore
import type {StrapiForgotPasswordData, StrapiResetPasswordData} from "@nuxtjs/strapi/dist/runtime/types";


export class AuthProvider {
    private authService: AuthService<LoginData, RegistrationData>;

    constructor(service: AuthService<LoginData, RegistrationData>) {
        this.authService = service;
    }

    setClient(authService: AuthService<LoginData, RegistrationData>) {
        this.authService = authService
    }

    async login(data: LoginData) {
        return await this.authService.login(data);
    }

    async register(data: RegistrationData) {
        return await this.authService.register(data);
    }

    async logout() {
        await this.authService.logout();
    }

    async fetchUser() {
        return await this.authService.fetchUser();
    }

    async resetPassword(data: StrapiResetPasswordData) {
        await this.authService.resetPassword<StrapiResetPasswordData>(data);
    }

    async forgotPassword(data: StrapiForgotPasswordData) {
        await this.authService.forgotPassword<StrapiForgotPasswordData>(data);
    }

}