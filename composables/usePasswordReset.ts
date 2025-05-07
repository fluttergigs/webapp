import { useAuthStore } from '~/stores/auth';
import { type ForgetPasswordData } from '~/services/auth/auth.types';
//@ts-ignore
import { storeToRefs } from 'pinia';
import { passwordForgetSchema, passwordResetSchema } from '~/core/validations/auth.validations';
import type { CallbackFunction } from '~/core/shared/types';
import { BaseToast } from '~/core/ui/base_toast';
import type { AppAnalyticsProvider } from '~/services/analytics/AppAnalyticsProvider';
import { AnalyticsEvent } from '~/services/analytics/events';
//@ts-ignore
import type { StrapiForgotPasswordData } from '@nuxtjs/strapi/dist/runtime/types';

export const usePasswordReset = () => {
  const authStore = useAuthStore();

  const passwordForgetDataInput = ref({
    email: '',
  } as ForgetPasswordData);

  const resetPasswordDataInput = ref({
    code: '',
    password: '',
    passwordConfirmation: '',
  });

  const canSubmitForgetPasswordForm = ref(false);
  const canSubmitResetPasswordForm = ref(false);

  const {
    $forgetPassword,
    isPasswordForgetFailed,
    isPasswordForgetSuccessful,
    isHandlingForgotPassword,
    isHandlingPasswordReset,
    isPasswordResetFailed,
    isPasswordResetSuccessful,
  } = storeToRefs(authStore);

  watch(
    passwordForgetDataInput,
    async () => {
      canSubmitForgetPasswordForm.value = await passwordForgetSchema.isValid(passwordForgetDataInput.value);
    },
    { immediate: true, deep: true },
  );

  watch(
    resetPasswordDataInput,
    async () => {
      canSubmitResetPasswordForm.value = await passwordResetSchema.isValid(resetPasswordDataInput.value);
    },
    { immediate: true, deep: true },
  );

  const submitPasswordForgetForm = async (onDone?: CallbackFunction<void>) => {

    const { $toast, $analytics } = useNuxtApp();
    ($analytics as AppAnalyticsProvider).capture(
      AnalyticsEvent.passwordForgetFormButtonClicked,
      passwordForgetDataInput.value,
    );

    await authStore.forgotPassword(passwordForgetDataInput.value);

    if (isPasswordForgetSuccessful.value) {
      ($analytics as AppAnalyticsProvider).capture(
        AnalyticsEvent.passwordForgetSuccessful,
        passwordForgetDataInput.value,
      );

      ($toast as BaseToast<Notification>).success(<string>$forgetPassword.value.message);

      onDone && onDone();
    }

    if (isPasswordForgetFailed.value) {
      ($toast as BaseToast<Notification>).error(<string>$forgetPassword.value.message);

      ($analytics as AppAnalyticsProvider).capture(
        AnalyticsEvent.passwordForgetFailed,
        passwordForgetDataInput.value,
      );
    }
  };


  const submitPasswordResetForm = async (onDone?: CallbackFunction<void>) => {
    const { $toast, $analytics } = useNuxtApp();
    ($analytics as AppAnalyticsProvider).capture(
      AnalyticsEvent.passwordResetButtonClicked,
      resetPasswordDataInput.value,
    );

    await authStore.resetPassword(resetPasswordDataInput.value);

    if (isPasswordResetSuccessful.value) {
      ($analytics as AppAnalyticsProvider).capture(
        AnalyticsEvent.passwordResetSuccessful,
        resetPasswordDataInput.value,
      );

      ($toast as BaseToast<Notification>).success(<string>$forgetPassword.value.message);

      onDone && onDone();
    }

    if (isPasswordResetFailed.value) {
      ($toast as BaseToast<Notification>).error(<string>$forgetPassword.value.message);

      ($analytics as AppAnalyticsProvider).capture(
        AnalyticsEvent.passwordResetFailed,
        resetPasswordDataInput.value,
      );
    }
  };

  return {
    passwordForgetDataInput,
    isHandlingForgotPassword,
    canSubmitForgetPasswordForm,
    canSubmitResetPasswordForm,
    isHandlingPasswordReset,
    isPasswordResetFailed,
    isPasswordResetSuccessful,
    resetPasswordDataInput,
    submitPasswordForgetForm,
    submitPasswordResetForm,
  };
};
