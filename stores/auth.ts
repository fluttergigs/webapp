import {defineStore} from "pinia";
import {LoginData, RegistrationData, User} from "~/services/auth/auth.types";
import {AppRoutes} from "~/core/routes";
import {generateUserName} from "~/core/utils";
import {logDev} from "~/core/helpers/log";
// @ts-ignore
import {jwtDecode} from "jwt-decode";
import {useNuxtApp} from "#imports"
import {Wrapper} from "~/core/wrapper";
import {SingleApiResponse} from "~/core/shared/types";
import {Endpoint} from "~/core/network/endpoints";
import {AppStrings} from "~/core/strings";
import {UpdatePasswordRequest, UpdateUserRequest} from "~/features/users/user.types";
import {AppAnalyticsProvider} from "~/services/analytics/app_analytics_provider";
import type {AuthProvider} from "~/services/auth/auth_provider";
import type {HttpClient} from "~/core/network/http_client";


//@ts-ignore
export let useAuthStore = defineStore('auth', {
    state: () => ({
        user: new Wrapper<User>().toInitial(),
        updateUser: new Wrapper<SingleApiResponse<User>>().toInitial(),
        changePassword: new Wrapper<SingleApiResponse<User>>().toInitial(),
        deleteAccount: new Wrapper().toInitial(),
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
            const {$auth, $analytics} = useNuxtApp()

            try {
                this.user = new Wrapper(null).toLoading()
                const response = await (<AuthProvider>$auth).login({identifier: email, password})

                //@ts-ignore
                this.user = this.user.toSuccess(unref(response.user))
                this.setToken(unref(response.jwt))

                //@ts-ignore
                $analytics.identify(this.user.value.email, this.user)
            } catch (error: any) {
                logDev('LOGIN ERROR', error)

                this.user = this.user.toFailed(error.error?.message ?? ' AppStrings.errorOccurred')
                throw error
            }
        },

        async register({email, password, firstName, lastName}: RegistrationData) {
            const {$auth, $analytics} = useNuxtApp()
            try {
                this.user = new Wrapper(null).toLoading()
                const username = generateUserName(email)

                const response = await (<AuthProvider>$auth).register({email, password, firstName, lastName, username});
                this.user = this.user.toSuccess(unref(response.user))

                // @ts-ignore
                $analytics.identify(this.user.value?.email, this.user)
                this.setToken(unref(response.jwt))
            } catch (error: any) {
                logDev(error)
                this.user = this.user.toFailed(error.error?.message ?? AppStrings.errorOccurred)
                throw error
            }
        },
        async logout() {
            try {
                logDev('LOGGING OUT...')
                const {$auth, $analytics} = useNuxtApp()
                await (<AuthProvider>$auth).logout()
                this.user = new Wrapper(null).toInitial()
                this.setToken('')
                (<AppAnalyticsProvider>$analytics).reset()
                await useRouter().push({path: AppRoutes.login})
            } catch (error) {
                logDev(error)
                //@ts-ignore
                this.errorMessage = error.message
                throw error
            }
        },

        async updateUserInfo(payload: UpdateUserRequest, onDone?: Function) {
            try {
                //@ts-ignore
                this.updateUser = new Wrapper<SingleApiResponse<User>>().toLoading()
                const {$http} = useNuxtApp()
                const response = await (<HttpClient>$http).put(`${Endpoint.users}/${useAuthStore().authUser.id}`, payload);
                //@ts-ignore
                this.updateUser = this.updateUser.toSuccess(response, AppStrings.yourProfileInfoHasBeenUpdatedSuccessfully)
                // logDev('COMPANY RESPONSE', response)
            } catch (e) {
                //@ts-ignore
                this.updateUser = this.updateUser.toFailed(AppStrings.unableToUpdateProfileInfo)
                throw e
            }
        },

        async changeUserPassword(payload: UpdatePasswordRequest, onDone?: Function) {
            try {
                //@ts-ignore
                this.changePassword = new Wrapper<SingleApiResponse<User>>().toLoading()
                const {$http} = useNuxtApp()
                const response = await (<HttpClient>$http).put(`${Endpoint.users}/${useAuthStore().authUser.id}`, payload);
                //@ts-ignore
                this.changePassword = this.changePassword.toSuccess(response, AppStrings.yourPasswordHasBeenUpdatedSuccessfully)
                // logDev('COMPANY RESPONSE', response)
            } catch (e) {
                //@ts-ignore
                this.changePassword = this.changePassword.toFailed(AppStrings.unableToUpdateYourPassword)
                throw e
            }
        },
        async fetchUser() {
            const {$auth, $analytics} = useNuxtApp()
            try {
                if (this.isAuthenticated) {
                    const response: User = await ($auth as AuthProvider).fetchUser();
                    //@ts-ignore
                    (<AppAnalyticsProvider>$analytics).identify(response!.email!, response!);
                    //@ts-ignore
                    this.user = new Wrapper().toSuccess(response);
                }
            } catch (error) {
                // $analytics.capture(AnalyticsEvent.error, {user: this.user})
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
            return (!!useAuthStore().authUser && Object.keys(useAuthStore().authUser).length > 0) ?? false;
        },
        userFullName: state => `${useAuthStore().authUser?.firstName ?? ''} ${useAuthStore().authUser?.lastName ?? ''}`,
        hasCompanies: (state) => (useAuthStore().authUser?.companies?.length > 0),

        myCompany: (state) => useAuthStore().hasCompanies ? useAuthStore().authUser?.companies[0] : null,
    },
    persist: {
        storage: persistedState.cookies,
        debug: true,
    }
})