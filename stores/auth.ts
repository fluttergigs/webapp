import {defineStore} from "pinia";
import {LoginData, RegistrationData, User} from "~/services/auth/auth.types";
import {useNuxtApp} from "#app";
import {AppRoutes} from "~/core/routes";
import {generateUserName} from "~/core/utils";
import {logDev} from "~/core/helpers/log";
import {jwtDecode} from "jwt-decode";

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

                $analytics.identify(this.user?.email, this.user)

                this.isProcessing = false
                this.errorMessage = ''
            } catch (error) {
                logDev('LOGIN ERROR', error)
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
                $analytics.identify(this.user?.email, this.user)

                this.setToken(unref(response.jwt))
                this.isProcessing = false
                this.errorMessage = ''
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
                logDev('LOGGING OUT...')
                const {$auth, $analytics} = useNuxtApp()
                await $auth.logout()
                this.user = <User>{}
                this.setToken('')
                $analytics.reset()
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
                if (this.isAuthenticated) {
                    const {$auth} = useNuxtApp()
                    const response = await $auth.fetchUser()
                    this.user = unref(response.user)
                    this.setToken(unref(response.jwt))
                }
            } catch (error) {
                logDev(error)
            }
        },

        setToken(token) {
            this.jwt = token;
        }
    },
    getters: {
        hasTokenExpired: state => !!state.jwt && Date.now() > (jwtDecode(state.jwt).exp * 1000),
        authUser: state => state.user as User,
        isAuthenticated: state => !!state.user && Object.keys(state.user || {}).length > 0,
        userFullName: state => `${state.user?.firstName ?? ''} ${state.user?.lastName ?? ''}`
    },
    persist: {
        storage: persistedState.localStorage,
        debug: true,
    }
})