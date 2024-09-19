import {useAuthStore} from "~/stores/auth";
import {AppRoutes} from "~/core/routes";

export default defineNuxtRouteMiddleware((from, to) => {
    const {isAuthenticated, hasReturnUrl, returnUrl} = useAuthStore()

    if (isAuthenticated) {
        return navigateTo(hasReturnUrl ? returnUrl : AppRoutes.myAccount)
    }
})