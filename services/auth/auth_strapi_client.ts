import {AuthService} from "~/services/auth/auth.base.service";
import {ResetPasswordData} from "~/services/auth/auth.types";
import {useStrapiAuth} from "#imports";
import {Endpoint} from "~/core/network/endpoints";


export class AuthStrapiClient<LoginData, StrapiRegistrationData> implements AuthService<LoginData, StrapiRegistrationData> {

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
        return useNuxtApp().$http.get(`${Endpoint.getMe}?populate=*`)
    }


}