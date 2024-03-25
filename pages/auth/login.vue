<template>

  <BasicFormContent title="Welcome Back"
                    description="Login and get access to thousands of opportunities for your enterprise">

    <template #form>
      <form class="space-y-4">
        <div class="block mb-5">
          <CustomInput name="email" placeholder="Email address" v-model="formInput.email" type="email"/>
        </div>
        <div class="block mb-5">
          <CustomInput name="password" placeholder="Password" v-model="formInput.password" type="password"
                       inside-text="Forgot Password?"/>
        </div>
        <button
            :disabled="!canSubmit ||user.isLoading"
            class="primary-button flex items-center justify-center space-x-2"
            type="button"
            @click.prevent="submit"
        >
          <LoadingSpinnerIcon v-if="user.isLoading" class="text-primary animate-spin"/>
          <span v-else> Sign In</span>

        </button>
        <p class="font-medium">
          <span>Don’t have an account?</span>
          <NuxtLink class="ml-2 text-indigo-600 hover:text-indigo-700" :to="AppRoutes.register">Create free account
          </NuxtLink>
        </p>
      </Form>
    </template>
  </BasicFormContent>
</template>
<script setup lang="ts">
import CustomInput from "~/components/forms/CustomInput.vue";
import {useAuthStore} from "~/stores/auth";
import {AppRoutes} from "~/core/routes";
import LoadingSpinnerIcon from "~/components/icons/LoadingSpinnerIcon.vue";
import {storeToRefs} from "pinia";
import {loginFormSchema} from "@/core/validations/auth.validations";
import {Form} from 'vee-validate'
import {AnalyticsEvent} from "~/services/analytics/events";
import BasicFormContent from "~/components/ui/BasicFormContent.vue";
import {AppAnalyticsProvider} from "~/services/analytics/app_analytics_provider";
import {BaseToast} from "~/core/ui/base_toast";
//@ts-ignore
import type {Notification} from "#ui/types";

useHead({title: "Flutter Gigs - Authentication"});

definePageMeta({
  middleware: ['logged-in']
})

const {$toast, $analytics} = useNuxtApp()

const authStore = useAuthStore()

const {user, returnUrl} = storeToRefs(authStore)
const canSubmit = ref(false)
const {login} = authStore

const formInput = ref({
  email: 'john@gmail.com',
  password: 'test1234',
})

watch(formInput, async () => {
  canSubmit.value = await loginFormSchema.isValid(formInput.value);

  //TODO - remove comment later
  /*if(canSubmit.value){
    await submit()
  }*/
}, {deep: true, immediate: true},)

onMounted(() => {
  ($analytics as AppAnalyticsProvider).capture(AnalyticsEvent.loginPageEntered);
})

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
  }
}

</script>
