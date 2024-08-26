import {AuthService} from "~/services/auth/auth.base.service";
import {LoginData, RegistrationData, ResetPasswordData} from "~/services/auth/auth.types";


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

    async resetPassword(data: ResetPasswordData) {
        await this.authService.resetPassword(data);
    }

}