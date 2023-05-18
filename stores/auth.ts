import {defineStore} from "pinia";
import {LoginData, RegistrationData, User} from "~/services/auth/auth.types";
import {useNuxtApp} from "#app";
import {AppRoutes} from "~/core/routes";
import {generateUserName} from "~/core/helpers";

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
            const {$auth, $toast} = useNuxtApp()

            try {
                const {$auth, $toast} = useNuxtApp()

                this.isProcessing = true
                const response = await $auth.login({identifier: email, password})

                //@ts-ignore
                this.user = unref(response.user)
                this.jwt = unref(response.jwt)

                $toast.info('Login successful')
                this.isProcessing = false
                useRouter().push({path: AppRoutes.dashboard})
            } catch (error) {
                this.isProcessing = false
                //@ts-ignore
                this.errorMessage = error.error.message
                $toast.error(this.errorMessage)
                throw error
            }
        },

        async register({email, password, firstName, lastName}: RegistrationData) {
            const {$auth, $toast} = useNuxtApp()
            try {
                const {$auth} = useNuxtApp()

                const username = generateUserName(email)
                this.isProcessing = true
                const response = await $auth.register({email, password, firstName, lastName, username})
                //@ts-ignore
                this.user = unref(response.user)
                this.jwt = unref(response.jwt)
                this.isProcessing = false
                useRouter().push({path: AppRoutes.dashboard})

            } catch (error) {
                console.error(error)
                this.isProcessing = false
                //@ts-ignore
                this.errorMessage = error.error.message
                $toast.error(this.errorMessage)
                throw error
            }
        },
        async logout() {
            try {
                const {$auth} = useNuxtApp()
                await $auth.logout()
                this.user = null

                useRouter().push({path: AppRoutes.login})

            } catch (error) {
                console.error(error)
                //@ts-ignore
                this.errorMessage = error.message
                throw error
            }
        },
    },
    getters: {
        authUser: state => state.user,
        isAuthenticated: state => Object.keys(state.user || {}).length > 0,
        userFullName: state => `${state.user?.firstName} ${state.user?.lastName}`
    },
    persist: true,
})