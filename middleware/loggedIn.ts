import {useAuthStore} from "~/stores/auth";
import {AppRoutes} from "~/core/routes";

export default defineNuxtRouteMiddleware((from, to) => {
    const {isAuthenticated} = useAuthStore()

    if (isAuthenticated) {
        navigateTo(AppRoutes.welcome)
    }
})