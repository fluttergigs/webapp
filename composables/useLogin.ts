import {storeToRefs} from "pinia";
import {loginFormSchema} from "~/core/validations/auth.validations";

import {ref, watch} from "vue";
import {useAuthStore} from "~/stores/auth";
import {AppAnalyticsProvider} from "~/services/analytics/app_analytics_provider";
import {AnalyticsEvent} from "~/services/analytics/events";
import {BaseToast} from "~/core/ui/base_toast";
import {AppRoutes} from "~/core/routes";
import {LoginData} from "~/services/auth/auth.types";

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

    const submit = async () => {
        try {
            const loginData = {email: formInput.value.email, password: formInput.value.password,};
            ($analytics as AppAnalyticsProvider).capture(AnalyticsEvent.loginButtonClicked, loginData);
            await login(loginData);
            ($analytics as AppAnalyticsProvider).capture(AnalyticsEvent.successfulLogin)
            await useRouter().push({path: !!returnUrl.value ? returnUrl.value : AppRoutes.myAccount})
        } catch (e) {
            //@ts-ignore
            ($toast as BaseToast<Notification>).error(user.value.message);

        } finally {
        }
    }

    return {
        user,
        returnUrl,
        canSubmit,
        login,
        formInput,
        submit
    }

}