import {defineStore} from "pinia";
import {LoginData, RegistrationData, User} from "~/services/auth/auth.types";
import {useNuxtApp} from "#app";
import {AppRoutes} from "~/core/routes";

export let useAuthStore = defineStore('auth', {
    state: () => ({
        user: <User>{},
        isProcessing: false,
        returnUrl: ''
    }),
    actions: {
        setReturnUrl(path: string) {
            this.returnUrl = path
        },
        async login({email, password}: LoginData) {
            try {
                const {$auth, $toast} = useNuxtApp()

                this.isProcessing = true
                const response = await $auth.login({identifier: email, password})
                this.user = response.user.value

                this.isProcessing = false

                $toast.info('Login successful')

                useRouter().push({path: AppRoutes.dashboard})
            } catch (error) {
                console.error(error)
                this.isProcessing = false
            }
        },

        async register({email, password, firstName, lastName}: RegistrationData) {
            try {
                const {$auth} = useNuxtApp()

                this.isProcessing = true
                const response = await $auth.register({email, password, firstName, lastName})
                this.user = response.user.value
                this.isProcessing = false

                useRouter().push({path: AppRoutes.dashboard})

            } catch (error) {
                console.error(error)
                this.isProcessing = false
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
            }
        },
    },
    getters: {
        authUser: state => state.user,
        isAuthenticated: state => Object.keys(state.user! || {}).length > 0
    }
})