import {defineStore} from "pinia";
import {LoginData, RegistrationData, User} from "~/services/auth/auth.types";
import {useNuxtApp} from "#app";
import {AppRoutes} from "~/core/routes";
import {generateUserName} from "~/core/utils";
import {logDev} from "~/core/helpers/log";

export let useAuthStore = defineStore('auth', {
    state: () => ({
        user: <User>{},
        jwt: '',
        isProcessing: false,
        returnUrl: '',
        errorMessage: ''
    }),
    actions: {
        setReturnUrl(path: string) {
            this.returnUrl = path
        },
        async login({email, password}: LoginData) {
            const {$auth, $analytics, $toast} = useNuxtApp()

            try {
                this.isProcessing = true
                const response = await $auth.login({identifier: email, password})

                //@ts-ignore
                this.user = unref(response.user)
                this.setToken(unref(response.jwt))

                $analytics.identifyUser(this.user?.email, this.user)

                this.isProcessing = false
            } catch (error) {
                logDev(error)
                this.isProcessing = false
                //@ts-ignore
                this.errorMessage = error.error.message
                throw error
            }
        },

        async register({email, password, firstName, lastName}: RegistrationData) {
            const {$auth, $analytics, $toast} = useNuxtApp()
            try {
                this.isProcessing = true
                const username = generateUserName(email)
                const response = await $auth.register({email, password, firstName, lastName, username})
                //@ts-ignore
                this.user = unref(response.user)
                $analytics.identifyUser(this.user?.email, this.user)

                this.setToken(unref(response.jwt))
                this.isProcessing = false
            } catch (error) {
                logDev(error)
                this.isProcessing = false
                //@ts-ignore
                this.errorMessage = error.error.message
                // $toast.error(this.errorMessage)
                throw error
            }
        },
        async logout() {
            try {
                const {$auth} = useNuxtApp()
                await $auth.logout()
                this.user = null
                await useRouter().push({path: AppRoutes.login})
            } catch (error) {
                logDev(error)
                //@ts-ignore
                this.errorMessage = error.message
                throw error
            }
        },

        async fetchUser() {
            try {
                const {$auth} = useNuxtApp()
                const response = await $auth.fetchUser()
                this.user = unref(response.user)
                this.setToken(unref(response.jwt))
            } catch (error) {
                logDev(error)
            }
        },

        setToken(token) {
            this.jwt = token;
        }
    },
    getters: {
        authUser: state => state.user,
        isAuthenticated: state => state.user && Object.keys(state.user || {}).length > 0,
        userFullName: state => `${state.user?.firstName} ${state.user?.lastName}`
    },
    persist: true,
})