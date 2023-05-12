<template>
  <section class="py-16 xl:pb-56 bg-white overflow-hidden">
    <div class="container px-4 mx-auto">
      <div class="text-center max-w-md mx-auto">
        <NuxtLink class="mb-36 inline-block" to="/">
          <img src="assets/images/logo.svg" alt=""/>
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
            <CustomInput placeholder="Email address" v-model="email" type="email"/>
          </div>
          <div class="block mb-5">
            <CustomInput placeholder="Password" v-model="password" type="password" inside-text="Forgot Password?"/>
          </div>
          <button
              :disabled="!canSubmit ||isProcessing"
              class="primary-button"
              type="button"
              @click.prevent="submit"
          >
            Sign In
          </button>
          <p class="font-medium">
            <span>Don’t have an account?</span>
            <NuxtLink class="ml-2 text-indigo-600 hover:text-indigo-700" :to="AppRoutes.register">Create free account
            </NuxtLink>
          </p>
        </form>
      </div>
    </div>
  </section>
</template>
<script setup>
import CustomInput from "~/components/forms/CustomInput.vue";
import {useAuthStore} from "~/stores/auth";
import {AppRoutes} from "~/core/routes";

const email = ref('')
const password = ref('')
const canSubmit = computed(() => email.value !== '' && password.value !== '')

const {login, isProcessing} = useAuthStore()

const submit = async () => {
  await login({email: email.value, password: password.value})
}


</script>
