import {useAuthStore} from "~/stores/auth";
import {type ForgetPasswordData} from "~/services/auth/auth.types";
//@ts-ignore
import {storeToRefs} from "pinia";
import {passwordForgetSchema} from "~/core/validations/auth.validations";
import type {CallbackFunction} from "~/core/shared/types";
import {BaseToast} from "~/core/ui/base_toast";
import {AppAnalyticsProvider} from "~/services/analytics/app_analytics_provider";
import {AnalyticsEvent} from "~/services/analytics/events";

export const usePasswordReset = () => {
    const authStore = useAuthStore();

    const passwordForgetDataInput = ref({
        email: "",
    } as ForgetPasswordData);

    const canSubmitForgetPasswordForm = ref(false);

    const {
        forgetPassword,
        isPasswordForgetFailed,
        isPasswordForgetSuccessful,
        isHandlingForgotPassword
    } = storeToRefs(authStore);

    watch(
        passwordForgetDataInput,
        async () => {
            canSubmitForgetPasswordForm.value = await passwordForgetSchema.isValid(passwordForgetDataInput.value);
        },
        {immediate: true, deep: true}
    );

    const submitPasswordForget = async (onDone?: CallbackFunction<void>) => {

        const {$toast, $analytics, $errorTracker} = useNuxtApp();
        ($analytics as AppAnalyticsProvider).capture(
            AnalyticsEvent.passwordForgetFormButtonClicked,
            {email: passwordForgetDataInput.value.email}
        );
        
        await authStore.forgotPassword(passwordForgetDataInput.value.email);

        if (isPasswordForgetSuccessful.value) {
            ($analytics as AppAnalyticsProvider).capture(
                AnalyticsEvent.passwordForgetSuccessful,
                {email: passwordForgetDataInput.value.email}
            );

            ($toast as BaseToast<Notification>).success(<string>forgetPassword.value.message);

            onDone && onDone();
        }

        if (isPasswordForgetFailed.value) {
            ($toast as BaseToast<Notification>).error(<string>forgetPassword.value.message);

            ($analytics as AppAnalyticsProvider).capture(
                AnalyticsEvent.passwordForgetFailed,
                {email: passwordForgetDataInput.value.email}
            );
        }
    }

    return {
        passwordForgetDataInput,
        isHandlingForgotPassword,
        canSubmitForgetPasswordForm,
        submitPasswordForget,
    }
};
