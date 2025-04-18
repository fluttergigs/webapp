import {storeToRefs} from "pinia";
import {AppRoutes} from "~/core/routes";
import {useAuthStore} from "~/stores/auth";
import {registerFormSchema} from "~/core/validations/auth.validations";
import {AnalyticsEvent} from "~/services/analytics/events";
import {AppAnalyticsProvider} from "~/services/analytics/app_analytics_provider";
import {BaseToast} from "~/core/ui/base_toast";
import {RegistrationData, User} from "~/services/auth/auth.types";
import type {CallbackFunction} from "~/core/shared/types";
import {useUser} from "~/composables/useUser";

export const useRegister = () => {
    let formInput = ref({
        /* email: "john@gmail.com",
             password: "test1234",
             firstName: "John",
             lastName: "Doe",*/
        email: "",
        password: "",
        // firstName: null,
        // lastName: null,
    } as RegistrationData);

    const canSubmit = ref(false);

    const {$toast, $analytics} = useNuxtApp();

    const authStore = useAuthStore();

    const {
        user,
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
        {deep: true, immediate: true}
    );

    onMounted(() => {
        ($analytics as AppAnalyticsProvider).capture(
            AnalyticsEvent.registrationPageEntered
        );
    });

    const submit = async (onDone?: CallbackFunction<User>) => {
        try {
            ($analytics as AppAnalyticsProvider).capture(
                AnalyticsEvent.registrationButtonClicked,
                formInput.value
            );
            await authStore.register(formInput.value);

            if (isSuccessfulRegistration.value) {
                ($analytics as AppAnalyticsProvider).capture(
                    AnalyticsEvent.successfulRegistration,
                    formInput.value
                );

                onDone?.(authUser.value);
            }
        } catch (e) {
            ($toast as BaseToast<Notification>).error(user.value.message);
        }
    };

    const onSuccessfulRegistration: CallbackFunction<User> = async (
        user?: User
    ) => {
        navigateTo(hasReturnUrl.value ? returnUrl.value : AppRoutes.jobs);
        await Promise.all([
            useUser().getUser(),
        ]);
    };

    return {
        isFailedRegistration,
        formInput,
        canSubmit,
        user,
        returnUrl,
        submit,
        onSuccessfulRegistration,
    };
};
