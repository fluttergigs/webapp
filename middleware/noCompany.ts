import useCompanyActions from "~/composables/useCompanyActions";

export default defineNuxtRouteMiddleware((from, to) => {
    const {checkCompanyExistenceGuard} = useCompanyActions()

    checkCompanyExistenceGuard()
})