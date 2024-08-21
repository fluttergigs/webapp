import {defineStore} from "pinia";
import {LoginData, RegistrationData, User} from "~/services/auth/auth.types";
import {AppRoutes} from "~/core/routes";
import {generateUserName} from "~/core/utils";
import {logDev} from "~/core/helpers/log";
// @ts-ignore
import {jwtDecode} from "jwt-decode";
import {Wrapper} from "~/core/wrapper";
import {BasicApiResponse, SingleApiResponse} from "~/core/shared/types";
import {Endpoint} from "~/core/network/endpoints";
import {AppStrings} from "~/core/strings";
import {UpdatePasswordRequest, UpdateUserRequest} from "~/features/users/user.types";
import {AppAnalyticsProvider} from "~/services/analytics/app_analytics_provider";
import type {AuthProvider} from "~/services/auth/auth_provider";
import type {HttpClient} from "~/core/network/http_client";
import {ErrorTrackerProvider} from "~/services/error-tracker/error_tracker_provider";


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
            const {$auth, $analytics, $errorTracker} = useNuxtApp()

            try {
                this.user = new Wrapper().toLoading()

                const response = await (<AuthProvider>$auth).login({identifier: email, password})

                //@ts-ignore
                this.user = this.user.toSuccess(unref(response.user))
                this.setToken(unref(response.jwt))

                ($analytics as AppAnalyticsProvider).identify(this.user.value.email, this.user.value);
                ($errorTracker as ErrorTrackerProvider).setUser(this.user.value)

                await this.fetchUser()
            } catch (customError) {

                let error = customError as BasicApiResponse
                logDev('ERROR', error)

                const message: string = (error.error.status === 500 || error.error.status === 401 ? AppStrings.invalidCredentials : error.message) ?? AppStrings.errorOccurred;

                this.user = this.user.toFailed(message)
                throw customError
            }
        },

        async register({email, password, firstName, lastName}: RegistrationData) {
            const {$auth, $analytics, $errorTracker} = useNuxtApp()
            try {
                this.user = new Wrapper<User>().toLoading()
                const username = generateUserName(email as string)

                const response = await (<AuthProvider>$auth).register({email, password, firstName, lastName, username});
                this.user = this.user.toSuccess(unref(response.user))

                ($analytics as AppAnalyticsProvider).identify(this.user.value?.email, this.user)
                ($errorTracker as ErrorTrackerProvider).setUser(this.user.value)

                this.setToken(unref(response.jwt))
                await this.fetchUser()
            } catch (customError: any) {
                logDev('Error', customError)

                let error = customError as BasicApiResponse

                const message: string = (error.error.status === 500 || error.error.status === 401 ? AppStrings.invalidCredentials : error.error.message) ?? AppStrings.errorOccurred;

                this.user = this.user.toFailed(message)
                throw customError
            }
        },
        async logout() {
            try {
                logDev('LOGGING OUT...')
                const {$auth, $analytics} = useNuxtApp()
                await (<AuthProvider>$auth).logout()
                this.user = new Wrapper().toInitial()
                this.setToken('');
                (<AppAnalyticsProvider>$analytics).reset();
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
                const response = await (<HttpClient>$http).put(`${Endpoint.users}/${useAuthStore().authUser?.id}`, payload);
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
                const response = await (<HttpClient>$http).put(`${Endpoint.users}/${useAuthStore().authUser?.id}`, payload);
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
            const {$auth, $analytics, $errorTracker} = useNuxtApp()
            try {
                if (this.isAuthenticated) {
                    logDev('FETCHING USER')
                    const response: User = await ($auth as AuthProvider).fetchUser();

                    //@ts-ignore
                    this.user = new Wrapper().toSuccess(response);
                    (<AppAnalyticsProvider>$analytics).identify(response!.email!, this.user);
                    ($errorTracker as ErrorTrackerProvider).setUser(this.user)
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
    },
    persist: {
        storage: persistedState.cookies,
        debug: true,
    }
})