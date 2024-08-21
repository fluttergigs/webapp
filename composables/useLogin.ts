import {storeToRefs} from "pinia";
import {loginFormSchema} from "~/core/validations/auth.validations";

import {useAuthStore} from "~/stores/auth";
import {AppAnalyticsProvider} from "~/services/analytics/app_analytics_provider";
import {AnalyticsEvent} from "~/services/analytics/events";
import {BaseToast} from "~/core/ui/base_toast";
import {AppRoutes} from "~/core/routes";
import {LoginData, User} from "~/services/auth/auth.types";
import type {CallbackFunction} from "~/core/shared/types";

export const useLogin = () => {
    const {$toast, $analytics} = useNuxtApp()

    const authStore = useAuthStore()

    const {user, returnUrl} = storeToRefs(authStore)
    const canSubmit = ref(false)
    const {login} = authStore

    const formInput = ref({
        email: 'john@gmail.com',
        password: 'test1234',
    } as LoginData)

    onMounted(() => {
        ($analytics as AppAnalyticsProvider).capture(AnalyticsEvent.loginPageEntered);
    })

    watch(formInput, async () => {
        canSubmit.value = await loginFormSchema.isValid(formInput.value);

        //TODO - remove comment later
        /*if(canSubmit.value){
          await submit()
        }*/
    }, {immediate: true, deep: true})

    const submit = async (onDone?: CallbackFunction<User>) => {
        try {
            const loginData = {email: formInput.value.email, password: formInput.value.password,};
            ($analytics as AppAnalyticsProvider).capture(AnalyticsEvent.loginButtonClicked, loginData);
            await login(loginData);
            ($analytics as AppAnalyticsProvider).capture(AnalyticsEvent.successfulLogin)

            onDone?.(user.value.value)
            navigateTo(returnUrl.value ?? AppRoutes.myAccount)
        } catch (e) {
            ($toast as BaseToast<Notification>).error(user.value.message);
        }
    }

    const onSuccessfulLogin: CallbackFunction<User> = (user?: User) => {
        navigateTo(returnUrl.value ?? AppRoutes.myAccount)
    }


    return {
        user,
        returnUrl,
        canSubmit,
        formInput,
        submit,
        onSuccessfulLogin
    }

}