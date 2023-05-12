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
          Join for free
        </h2>
        <p class="mb-12 font-medium text-lg text-gray-600 leading-normal">
          Create an account to get acccess thousands of Flutter job offers and Consultants
        </p>
        <form class="flex flex-col space-y-4">
          <div class="flex space-x-4 mb-5">
            <CustomInput placeholder="First name" v-model="firstName"/>
            <CustomInput placeholder="Last name" v-model="lastName"/>
          </div>
          <div class="block mb-5">
            <CustomInput placeholder="Email address" v-model="email" type="email"/>
          </div>
          <div class="block mb-5">
            <CustomInput placeholder="Password" v-model="password" type="password"/>
          </div>
          <button
              :disabled="!canSubmit ||isProcessing"
              type="button"
              @click.prevent="submit"
              class="primary-button"
          >
            Create Account
          </button>
          <p class="font-medium">
            <span>Already have an account?</span>
            <NuxtLink class="text-indigo-600 hover:text-indigo-700" :to="AppRoutes.login">Login</NuxtLink>
          </p>
        </form>
      </div>
    </div>
  </section>
</template>
<script setup>
import CustomInput from "~/components/forms/CustomInput.vue";
import {AppRoutes} from "~/core/routes";
import {useAuthStore} from "~/stores/auth";

const email = ref('')
const firstName = ref('')
const lastName = ref('')
const password = ref('')
const canSubmit = computed(() => email.value !== '' && password.value !== '')

const {register, isProcessing} = useAuthStore()

const submit = async () => {
  await register({email: email.value, password: password.value, firstName: firstName.value, lastName: lastName.value})
}


</script>
