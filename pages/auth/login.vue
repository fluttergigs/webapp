<template>
  <section class="py-16 xl:pb-56 bg-white overflow-hidden">
    <div class="container px-4 mx-auto">
      <div class="text-center max-w-md mx-auto">
        <NuxtLink class="mb-36 inline-block" to="/">
          <img src="@/assets/images/logo.svg" alt=""/>
        </NuxtLink>
        <h2
            class="mb-4 text-6xl md:text-7xl text-center font-bold font-heading tracking-px-n leading-tight"
        >
          Welcome Back
        </h2>
        <p class="mb-12 font-medium text-lg text-gray-600 leading-normal">
          Login and get access to thousands of opportunities for your enterprise
        </p>
        <form class="space-y-4">
          <div class="block mb-5">
            <CustomInput name="email" placeholder="Email address" v-model="formInput.email" type="email"/>
          </div>
          <div class="block mb-5">
            <CustomInput name="password" placeholder="Password" v-model="formInput.password" type="password"
                         inside-text="Forgot Password?"/>
          </div>
          <button
              :disabled="!canSubmit ||isProcessing"
              class="primary-button flex items-center justify-center space-x-2"
              type="button"
              @click.prevent="submit"
          >
            <LoadingSpinnerIcon v-if="isProcessing" class="text-primary animate-spin"/>
            <span v-else> Sign In</span>

          </button>
          <p class="font-medium">
            <span>Don’t have an account?</span>
            <NuxtLink class="ml-2 text-indigo-600 hover:text-indigo-700" :to="AppRoutes.register">Create free account
            </NuxtLink>
          </p>
        </Form>
      </div>
    </div>
  </section>
</template>
<script setup lang="ts">
import CustomInput from "~/components/forms/CustomInput.vue";
import {useAuthStore} from "~/stores/auth";
import {AppRoutes} from "~/core/routes";
import LoadingSpinnerIcon from "~/components/icons/LoadingSpinnerIcon.vue";
import {storeToRefs} from "pinia";
import {loginFormSchema} from "@/core/validations";
import {Form} from 'vee-validate'
import {useNuxtApp} from "#app";
import {AnalyticsEvent} from "~/services/analytics/events";

useHead({title: "Flutter Gigs - Authentication"});

definePageMeta({
  middleware: ['logged-in']
})

const {$toast, $analytics} = useNuxtApp()

const authStore = useAuthStore()

const {isProcessing, returnUrl} = storeToRefs(authStore)

const formInput = ref({
  email: 'john@gmail.com',
  password: 'test1234',
})

const canSubmit = ref(false)

const {login, errorMessage} = authStore

watch(formInput, async (oldVal, newVal) => {
  canSubmit.value = await loginFormSchema.isValid(formInput.value);

  //TODO - remove comment later
  /*if(canSubmit.value){
    await submit()
  }*/
}, {deep: true, immediate: true},)

onMounted(() => {
  $analytics.capture(AnalyticsEvent.loginPageEntered);
})

const submit = async () => {
  try {
    const loginData = {email: formInput.value.email, password: formInput.value.password,}
    $analytics.capture(AnalyticsEvent.loginButtonClicked, loginData)
    await login(loginData)
    $analytics.capture(AnalyticsEvent.successfulLogin)
    await useRouter().push({path: !!returnUrl.value ? returnUrl.value : AppRoutes.welcome})
  } catch (e) {
    $toast.error(errorMessage);
  }
}

</script>
