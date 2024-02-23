import {AuthProvider} from "~/services/auth/auth_provider";
import {AuthStrapiClient} from "~/services/auth/auth_strapi_client";
import {StrapiAuthenticationData, StrapiRegistrationData} from "@nuxtjs/strapi/dist/runtime/types";

export default defineNuxtPlugin((nuxtApp) => {
    // @ts-ignore
    const authProvider: AuthProvider = new AuthProvider<StrapiAuthenticationData, StrapiRegistrationData>(new AuthStrapiClient());

    return {
        provide: {
            auth: authProvider,
        }
    }
})