import {AuthService} from "~/services/auth/auth.base.service";
import {User} from "~/services/auth/auth.types";
import {Endpoint} from "~/core/network/endpoints";
import type {HttpClient} from "~/core/network/http_client";
import {BasicApiResponse} from "~/core/shared/types";
//@ts-ignore
import {StrapiForgotPasswordData, StrapiResetPasswordData} from "@nuxtjs/strapi/dist/runtime/types";

export class AuthStrapiClient<LoginData, StrapiRegistrationData> implements AuthService<LoginData, StrapiRegistrationData> {

    private strapiAuth = useStrapiAuth();

    async login(data: any): Promise<User | BasicApiResponse> {
        return this.strapiAuth.login(data)
    }

    async logout(): Promise<void> {
        this.strapiAuth.logout()
    }

    async register(data: StrapiRegistrationData): Promise<User | BasicApiResponse> {
        return this.strapiAuth.register(data)
    }

    async resetPassword<StrapiResetPasswordData>(data: StrapiResetPasswordData): Promise<any> {
        return this.strapiAuth.resetPassword(data)
    }

    async forgotPassword<StrapiForgotPasswordData>(data: StrapiForgotPasswordData): Promise<any> {
        return this.strapiAuth.forgotPassword(data)
    }

    async fetchUser(): Promise<any> {
        return (useNuxtApp().$http as HttpClient).get(`${Endpoint.getMe}?populate=*`)
    }

}