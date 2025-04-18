import { defineStore } from 'pinia';
import { LoginData, RegistrationData, User } from '~/services/auth/auth.types';
import { AppRoutes } from '~/core/routes';
import { generateUserName } from '~/core/utils';
import { logDev } from '~/core/helpers/log';
// @ts-ignore
import { jwtDecode } from 'jwt-decode';
import { Wrapper } from '~/core/wrapper';
import { BasicApiResponse, SingleApiResponse } from '~/core/shared/types';
import { Endpoint } from '~/core/network/endpoints';
import { AppStrings } from '~/core/strings';
import { UpdatePasswordRequest, UpdateUserRequest } from '~/features/users/user.types';
import { AppAnalyticsProvider } from '~/services/analytics/AppAnalyticsProvider';
import type { AuthProvider } from '~/services/auth/AuthProvider';
import type { HttpClient } from '~/core/network/http_client';
import { ErrorTrackerProvider } from '~/services/error-tracker/ErrorTrackerProvider';

//@ts-ignore
export const useAuthStore = defineStore('auth', {
  state: () => ({
    $user: new Wrapper<User>().toInitial(),
    $login: new Wrapper<User>().toInitial(),
    $register: new Wrapper<User>().toInitial(),
    $updateUser: new Wrapper<SingleApiResponse<User>>().toInitial(),
    $fetchUser: new Wrapper<User>().toInitial(),
    $changePassword: new Wrapper<SingleApiResponse<User>>().toInitial(),
    $forgetPassword: new Wrapper<{}>().toInitial(),
    $resetPassword: new Wrapper<{}>().toInitial(),
    $deleteAccount: new Wrapper().toInitial(),
    jwt: '',
    isProcessing: false,
    returnUrl: '',
    errorMessage: '',
  }),
  actions: {
    setReturnUrl(path: string) {
      this.returnUrl = path;
    },
    async login({ email, password }: LoginData) {
      const { $auth, $analytics, $errorTracker } = useNuxtApp();

      try {
        this.$user = new Wrapper<User>().toLoading();
        this.$login = new Wrapper<User>().toLoading();

        const response = await (<AuthProvider>$auth).login({
          identifier: email,
          password,
        });

        this.setToken(unref(response.jwt));

        this.$login = this.$login.toSuccess(unref(response.user));

        this.$user = this.$user.toSuccess(unref(response.user));
        //@ts-ignore
        this.user = this.user.toSuccess(unref(response.user));
      } catch (customError) {
        this.setToken('');

        const error = customError as BasicApiResponse;
        logDev('ERROR', error);

        let message = '';
        if (error.error) {
          if (error?.error?.status === 401 || error?.error?.status === 500) {
            message = AppStrings.invalidCredentials;
          } else {
            message = error.error.message ?? AppStrings.errorOccurred;
          }
        } else {
          message = AppStrings.errorOccurred;
        }

        this.$login = this.$login.toFailed(message);

        this.$user = this.$user.toFailed(message);
        throw customError;
      }
    },

    async register({ email, password, firstName, lastName }: RegistrationData) {
      const { $auth, $analytics, $errorTracker } = useNuxtApp();
      try {
        this.$user = new Wrapper<User>().toLoading();
        this.$register = new Wrapper<User>().toLoading();

        const response = await ($auth as AuthProvider).register({
          email,
          password,
          firstName,
          lastName,
          username: generateUserName(email as string),
        });

        this.setToken(unref(response.jwt));

        this.$user = Wrapper.getEmpty().toSuccess(
          unref(response.user),
        ) as unknown as Wrapper<User>;

        this.$register = this.$register.toSuccess(unref(response.user));
      } catch (customError: any) {
        this.setToken('');

        logDev('Error', customError);

        const error = customError as BasicApiResponse;

        let message = '';

        if (error.error) {
          if (error?.error?.status === 401) {
            message = error.error.message ?? AppStrings.invalidCredentials;
          } else if (error?.error?.status === 500) {
            message = AppStrings.emailAlreadyTaken;
          } else {
            message = error.error.message ?? AppStrings.errorOccurred;
          }
        } else {
          message = AppStrings.errorOccurred;
        }

        this.$user = this.$user.toFailed(message);
        this.$register = this.$register.toFailed(message);
        throw customError;
      }
    },
    async logout() {
      try {
        logDev('LOGGING OUT...');

        const { $auth, $analytics, $errorTracker } = useNuxtApp();
        (<AppAnalyticsProvider>$analytics).reset();
        (<ErrorTrackerProvider>$errorTracker).setUser(null);
        await (<AuthProvider>$auth).logout();
        this.$user = new Wrapper<User>().toInitial();
        this.setReturnUrl('');
        this.setToken('');
        await useRouter().push({ path: AppRoutes.login });
      } catch (error) {
        logDev(error);
        //@ts-ignore
        this.errorMessage = error.message;
        throw error;
      }
    },

    async updateUserInfo(payload: UpdateUserRequest, onDone?: Function) {
      try {
        //@ts-ignore
        this.$updateUser = new Wrapper<SingleApiResponse<User>>().toLoading();
        const { $http } = useNuxtApp();
        const response = await (<HttpClient>$http).put<SingleApiResponse<User>>(
          `${Endpoint.users}/${useAuthStore().authUser?.id}`,
          payload,
        );
        //@ts-ignore
        this.$updateUser = this.$updateUser.toSuccess(
          response,
          AppStrings.yourProfileInfoHasBeenUpdatedSuccessfully,
        );
        // logDev('COMPANY RESPONSE', response)
      } catch (e) {
        //@ts-ignore
        this.$updateUser = this.$updateUser.toFailed(
          AppStrings.unableToUpdateProfileInfo,
        );
        throw e;
      }
    },

    async changeUserPassword(
      payload: UpdatePasswordRequest,
      onDone?: Function,
    ) {
      try {
        //@ts-ignore
        this.$changePassword = new Wrapper<SingleApiResponse<User>>().toLoading();
        const { $http } = useNuxtApp();
        const response = await (<HttpClient>$http).put<SingleApiResponse<User>>(
          `${Endpoint.users}/${useAuthStore().authUser?.id}`,
          payload,
        );
        this.$changePassword = this.$changePassword.toSuccess(
          response,
          AppStrings.yourPasswordHasBeenUpdatedSuccessfully,
        );
        // logDev('COMPANY RESPONSE', response)
      } catch (e) {
        this.$changePassword = this.$changePassword.toFailed(
          AppStrings.unableToUpdateYourPassword,
        );
        throw e;
      }
    },


    async forgotPassword<T>(data: T) {
      try {
        const { $auth } = useNuxtApp();

        this.$forgetPassword = new Wrapper().toLoading();

        await (<AuthProvider>$auth).forgotPassword<T>(data);

        this.$forgetPassword = this.$forgetPassword.toSuccess({}, AppStrings.passwordResetEmailSent);

      } catch (e) {
        //@ts-ignore
        this.forgetPassword = this.forgetPassword.toFailed(AppStrings.failedToSendPasswordResetEmail);
      }
    },

    async resetPassword<T>(data: T) {
      try {
        const { $auth } = useNuxtApp();
        this.$resetPassword = new Wrapper().toLoading();
        await ($auth as AuthProvider).resetPassword<T>(data);
        this.$resetPassword = this.$resetPassword.toSuccess({}, AppStrings.passwordResetSuccessful);
      } catch (e) {
        //@ts-ignore
        this.forgetPassword = this.forgetPassword.toFailed(AppStrings.passwordResetFailed);

      }
    },

    async getUser() {
      const { $auth, $analytics, $errorTracker } = useNuxtApp();
      try {
        if (this.isAuthenticated) {
          logDev('FETCHING USER');

          this.$fetchUser = new Wrapper<User>().toLoading();
          const response: User = await ($auth as AuthProvider).fetchUser();

          this.$fetchUser = new Wrapper<User>().toSuccess(response);
          //@ts-ignore
          this.$user = new Wrapper().toSuccess(response);
          /*  (<AppAnalyticsProvider>$analytics).identify(
                        response!.email!,
                        this.user
                      );
                      (<ErrorTrackerProvider>$errorTracker).setUser(this.user);*/
        }
      } catch (error) {
        this.$fetchUser = new Wrapper<User>().toFailed(AppStrings.errorOccurred);
        // $analytics.capture(AnalyticsEvent.error, {user: this.user})
        logDev(error);
      }
    },
    setToken(token: string) {
      this.jwt = token;
    },
  },
  getters: {
    isHandlingForgotPassword: (state) => state.$forgetPassword.isLoading,
    isPasswordForgetSuccessful: (state) => state.$forgetPassword.isSuccess,
    isPasswordForgetFailed: (state) => state.$forgetPassword.isFailure,
    isHandlingPasswordReset: (state) => state.$resetPassword.isLoading,
    isPasswordResetSuccessful: (state) => state.$resetPassword.isSuccess,
    isPasswordResetFailed: (state) => state.$resetPassword.isFailure,
    isUserFetching: (state) => state.$fetchUser.isLoading,
    isUserFetched: (state) => state.$fetchUser.isSuccess,
    isUserFetchFailed: (state) => state.$fetchUser.isFailure,
    isSuccessfulRegistration: (state) => state.$register.isSuccess,
    isFailedRegistration: (state) => state.$register.isFailure,
    isSuccessfulLogin: (state) => state.$login.isSuccess,
    isFailedLogin: (state) => state.$login.isFailure,
    hasTokenExpired: (state) =>
      state.jwt != '' && Date.now() > jwtDecode(state.jwt).exp! * 1000,
    authUser: (state) => state.$user.value as User,
    isAuthenticated(state): boolean {
      return (!!useAuthStore().authUser &&
          Object.keys(useAuthStore().authUser).length > 0) ??
        false;
    },
    userFullName: (state) =>
      `${useAuthStore().authUser?.firstName ?? ''} ${
        useAuthStore().authUser?.lastName ?? ''
      }`,
    displayName: (state) => useAuthStore().userFullName || useAuthStore().authUser?.username,
    hasReturnUrl: (state) => !!state.returnUrl || state.returnUrl !== '',
  },
  persist: {
    storage: persistedState.cookies,
    debug: true,
  },
});
