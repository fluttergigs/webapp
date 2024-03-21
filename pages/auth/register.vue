<template>
  <BasicFormContent
      title="Join for free"
      description="Create an account to get access thousands of Flutter job offers and Consultants">

    <template #form>
      <form class="flex flex-col space-y-4">
        <div class="flex space-x-4 mb-5 w-full">
          <CustomInput class="w-1/2" name="firstName" placeholder="First name" v-model="formInput.firstName"/>
          <CustomInput class="w-1/2" name="lastName" placeholder="Last name" v-model="formInput.lastName"/>
        </div>
        <div class="block mb-5">
          <CustomInput name="email" placeholder="Email address" v-model="formInput.email" type="email"/>
        </div>
        <div class="block mb-5">
          <CustomInput name="password" placeholder="Password" v-model="formInput.password" type="password"/>
        </div>
        <button
            :disabled="!canSubmit ||user.isLoading"
            class="primary-button flex items-center justify-center space-x-2"
            type="button"
            @click.prevent="submit"
        >
          <LoadingSpinnerIcon v-if="user.isLoading" class="text-primary animate-spin"/>
          <span v-else> Create account</span>

        </button>
        <p class="font-medium text-center mx-auto">
          <span class="mr-2">Already have an account?</span>
          <NuxtLink class="text-indigo-600 hover:text-indigo-700" :to="AppRoutes.login">Login</NuxtLink>
        </p>
      </form>
    </template>
  </BasicFormContent>
</template>
<script setup lang="ts">
import CustomInput from "~/components/forms/CustomInput.vue";
import {AppRoutes} from "~/core/routes";
import {useAuthStore} from "~/stores/auth";
import {storeToRefs} from "pinia";
import LoadingSpinnerIcon from "~/components/icons/LoadingSpinnerIcon.vue";
import {registerFormSchema} from "@/core/validations/auth.validations";
import {AnalyticsEvent} from "~/services/analytics/events";
import BasicFormContent from "~/components/ui/BasicFormContent.vue";
import {AppAnalyticsProvider} from "~/services/analytics/app_analytics_provider";
import {BaseToast} from "~/core/ui/base_toast";
//@ts-ignore
import type {Notification} from "#ui/types";

useHead({title: "Flutter Gigs - Authentication"});

definePageMeta({
  middleware: ['logged-in'],
})

let formInput = ref({
  email: 'john@gmail.com',
  password: 'test1234',
  firstName: 'John',
  lastName: 'Doe'
})

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

</script>
