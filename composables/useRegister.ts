import {storeToRefs} from "pinia";
import {AppRoutes} from "~/core/routes";
import {useAuthStore} from "~/stores/auth";
import {registerFormSchema} from "~/core/validations/auth.validations";
import {AnalyticsEvent} from "~/services/analytics/events";
import {AppAnalyticsProvider} from "~/services/analytics/app_analytics_provider";
import {BaseToast} from "~/core/ui/base_toast";
import {RegistrationData} from "~/services/auth/auth.types";

export const useRegister = () => {

    let formInput = ref({
        email: 'john@gmail.com',
        password: 'test1234',
        firstName: 'John',
        lastName: 'Doe'
    } as RegistrationData)

    const canSubmit = ref(false)

    const {$toast, $analytics} = useNuxtApp()

    const authStore = useAuthStore()

    const {user, returnUrl} = storeToRefs(authStore)

    const {register} = authStore

    watch(formInput, async () => {
        canSubmit.value = await registerFormSchema.isValid(formInput.value);
        //TODO - remove comment later
        /*if(canSubmit.value){
          await submit()
        }*/

    }, {deep: true, immediate: true},)

    onMounted(() => {
        ($analytics as AppAnalyticsProvider).capture(AnalyticsEvent.registrationPageEntered);
    })

    const submit = async () => {
        try {
            ($analytics as AppAnalyticsProvider).capture(AnalyticsEvent.registrationButtonClicked, formInput.value);
            await register(formInput.value);
            ($analytics as AppAnalyticsProvider).capture(AnalyticsEvent.successfulRegistration, formInput.value);
            await useRouter().push({path: !!returnUrl.value ? returnUrl.value : AppRoutes.myAccount})
        } catch (e) {
            //@ts-ignore
            ($toast as BaseToast<Notification>).error(user.value.message);
        }
    }


    return {
        formInput,
        canSubmit,
        user,
        returnUrl,
        register,
        submit
    }
}