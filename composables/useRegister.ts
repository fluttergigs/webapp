import { storeToRefs } from 'pinia';
import { useUser } from '~/composables/useUser';
import { AppRoutes } from '~/core/routes';
import type { CallbackFunction } from '~/core/shared/types';
import { BaseToast } from '~/core/ui/base_toast';
import { registerFormSchema } from '~/core/validations/auth.validations';
import type { AppAnalyticsProvider } from '~/services/analytics/AppAnalyticsProvider';
import { AnalyticsEvent } from '~/services/analytics/events';
import { RegistrationData, User } from '~/services/auth/auth.types';
import { useAuthStore } from '~/stores/auth';

export const useRegister = () => {
  let formInput = ref({
    /* email: "john@gmail.com",
         password: "test1234",
         firstName: "John",
         lastName: "Doe",*/
    email: '',
    password: '',
    // firstName: null,
    // lastName: null,
  } as RegistrationData);

  const canSubmit = ref(false);

  const { $toast, $analytics } = useNuxtApp();

  const authStore = useAuthStore();

  const {
    user: $user,
    authUser,
    hasReturnUrl,
    returnUrl,
    isSuccessfulRegistration,
    isFailedRegistration,
  } = storeToRefs(authStore);

  watch(
    formInput,
    async () => {
      canSubmit.value = await registerFormSchema.isValid(formInput.value);
      //TODO - remove comment later
      /*if(canSubmit.value){
                                  await submit()
                                }*/
    },
    { deep: true, immediate: true },
  );

  onMounted(() => {
    ($analytics as AppAnalyticsProvider).capture(AnalyticsEvent.registrationPageEntered);
  });

  const submit = async (onDone?: CallbackFunction<User>) => {
    try {
      ($analytics as AppAnalyticsProvider).capture(
        AnalyticsEvent.registrationButtonClicked,
        formInput.value,
      );
      await authStore.register(formInput.value);

      if (isSuccessfulRegistration.value) {
        ($analytics as AppAnalyticsProvider).capture(
          AnalyticsEvent.successfulRegistration,
          formInput.value,
        );

        onDone?.(authUser.value);
      }

      if (isFailedRegistration.value) {
        ($toast as BaseToast<Notification>).error($user.value.message);
      }
    } catch (e) {
      ($toast as BaseToast<Notification>).error(AppStrings.errorOccurred);
    }
  };

  const onSuccessfulRegistration: CallbackFunction<User> = async (user?: User) => {
    navigateTo(hasReturnUrl.value ? returnUrl.value : AppRoutes.jobs);
    await Promise.all([useUser().getUser()]);
  };

  return {
    isFailedRegistration,
    formInput,
    canSubmit,
    user: $user,
    returnUrl,
    submit,
    onSuccessfulRegistration,
  };
};
