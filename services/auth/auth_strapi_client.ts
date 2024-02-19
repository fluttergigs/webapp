import {AuthService} from "~/services/auth/auth.base.service";
import {LoginData, ResetPasswordData} from "~/services/auth/auth.types";
import {StrapiAuthenticationData, StrapiRegistrationData} from "@nuxtjs/strapi/dist/runtime/types";
import {useStrapiAuth} from "#imports";


export class AuthStrapiClient implements AuthService<LoginData, StrapiRegistrationData> {

    private strapiAuth = useStrapiAuth();

    async login(data): Promise<any> {
        return this.strapiAuth.login(data)
    }

    async logout(): Promise<void> {
        await this.strapiAuth.logout()
    }

    async register(data: StrapiRegistrationData): Promise<any> {
        return this.strapiAuth.register(data)
    }

    async resetPassword(data: ResetPasswordData): Promise<any> {
        return this.strapiAuth.forgotPassword(data)
    }

    async fetchUser(): Promise<any> {
        return this.strapiAuth.fetchUser();
    }


}