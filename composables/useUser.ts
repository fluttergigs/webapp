import { storeToRefs } from 'pinia';
import { AnalyticsEvent } from '~/services/analytics/events';
import { BaseToast } from '~/core/ui/base_toast';
import type { UpdatePasswordRequest, UpdateUserRequest } from '~/features/users/user.types';

export function useUser() {
  const authStore = useAuthStore();
  const { $toast } = useNuxtApp();

  const { isUserFetched, authUser, isAuthenticated, isHandlingForgotPassword } = storeToRefs(authStore);

  const getUser = async () => {
    await authStore.getUser();

    if (isUserFetched.value) {
      await useAnalytics().identifyUser(authUser.value);
    }
  };

  const updateUser = async (request: UpdateUserRequest) => {
    try {
      useAnalytics().capture(AnalyticsEvent.userUpdateButtonClicked, request.data);
      await authStore.updateUserInfo(request, async () => {
        await getUser();
        useAnalytics().capture(AnalyticsEvent.successfulUserInfoUpdate, request.data);
        ($toast as BaseToast<Notification, number>).success(<string>authStore.updateUser!.message);
      });

    } catch (e) {
      ($toast as BaseToast<Notification, number>).error(<string>authStore.updateUser!.message);
    }
  };

  const updatePassword = async (request: UpdatePasswordRequest) => {
    try {
      useAnalytics().capture(AnalyticsEvent.changePasswordButtonClicked, request.data);

      await authStore.changeUserPassword({ data: request.data.password }, async () => {
        await getUser();
        useAnalytics().capture(AnalyticsEvent.successfulPasswordChange, request.data);
        ($toast as BaseToast<Notification, number>).success(<string>authStore.updateUser!.message);
      });
    } catch (e) {
      ($toast as BaseToast<Notification, number>).error(<string>authStore.updateUser!.message);
    }
  };

  const logout = async () => {
    useAnalytics().capture(AnalyticsEvent.logoutButtonClicked);
    await authStore.logout();
  };

  return {
    getUser,
    logout,
    updateUser,
    updatePassword,
    isAuthenticated,
  };
}
