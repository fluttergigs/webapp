import {AuthService} from "~/services/auth/auth_service";
import {useStrapiAuth} from "@nuxtjs/strapi/dist/runtime/composables/useStrapiAuth";

export default defineNuxtPlugin((nuxtApp) => {

    const authService = new AuthService({name: 'Strapi', provider: useStrapiAuth()})


    return {
        provide: {
            auth: authService.auth.provider
        }
    }

})