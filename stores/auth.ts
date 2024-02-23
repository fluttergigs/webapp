import {defineStore} from "pinia";
import {LoginData, RegistrationData, User} from "~/services/auth/auth.types";
import {AppRoutes} from "~/core/routes";
import {generateUserName} from "~/core/utils";
import {logDev} from "~/core/helpers/log";
import {jwtDecode} from "jwt-decode";
import {Wrapper} from "~/core/wrapper";


//@ts-ignore
export let useAuthStore = defineStore('auth', {
    state: () => ({
        user: new Wrapper<User>().toInitial(),
        jwt: '',
        isProcessing: false,
        returnUrl: '',
        errorMessage: '',
    }),
    actions: {
        setReturnUrl(path: string) {
            this.returnUrl = path
        },
        async login({email, password}: LoginData) {
            const {$auth, $analytics, $toast} = useNuxtApp()

            try {
                this.user = new Wrapper(null).toLoading()
                const response = await $auth.login({identifier: email, password})

                //@ts-ignore
                this.user = this.user.toSuccess(unref(response.user))
                this.setToken(unref(response.jwt))

                //@ts-ignore
                $analytics.identify(this.user.value.email, this.user)
            } catch (error: any) {
                logDev('LOGIN ERROR', error)

                this.user = this.user.toFailed(error.error.message)
                throw error
            }
        },

        async register({email, password, firstName, lastName}: RegistrationData) {
            const {$auth, $analytics, $toast} = useNuxtApp()
            try {
                this.user = new Wrapper(null).toLoading()
                const username = generateUserName(email)

                const response = await $auth.register({email, password, firstName, lastName, username})
                this.user = this.user.toSuccess(unref(response.user))

                // @ts-ignore
                $analytics.identify(this.user.value?.email, this.user)
                this.setToken(unref(response.jwt))
            } catch (error: any) {
                logDev(error)
                this.user = this.user.toFailed(error.error.message)
                throw error
            }
        },
        async logout() {
            try {
                logDev('LOGGING OUT...')
                const {$auth, $analytics} = useNuxtApp()
                await $auth.logout()
                this.user = new Wrapper(null).toInitial()
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
                    const {$auth, $analytics} = useNuxtApp()
                    const response: User = await $auth.fetchUser()
                    $analytics.identify(response!.email!, response!)
                    //@ts-ignore
                    this.user = new Wrapper().toSuccess(response)
                }
            } catch (error) {
                logDev(error)
            }
        },

        setToken(token: string) {
            this.jwt = token;
        }
    },
    getters: {
        hasTokenExpired: state => !!state.jwt && Date.now() > (jwtDecode(state.jwt).exp! * 1000),
        authUser: state => (state.user._value as User),
        isAuthenticated: state => {
            return !!useAuthStore().authUser && Object.keys(useAuthStore().authUser).length > 0;
        },
        userFullName: state => `${useAuthStore().authUser?.firstName ?? ''} ${useAuthStore().authUser?.lastName ?? ''}`,
        hasCompanies: (state) => useAuthStore().authUser?.companies?.length > 0
    },
    persist: {
        storage: persistedState.cookies,
        debug: true,
    }
})