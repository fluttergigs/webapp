import {AuthService} from "~/services/auth/auth.service";

export default defineNuxtPlugin((nuxtApp) => {
    const authService = new AuthService({name: 'Strapi', provider: useStrapiAuth()})

    return {
        provide: {
            auth: authService.auth.provider
        }
    }

})