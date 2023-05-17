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
          Join for free
        </h2>
        <p class="mb-12 font-medium text-lg text-gray-600 leading-normal">
          Create an account to get access thousands of Flutter job offers and Consultants
        </p>
        <form class="flex flex-col space-y-4">
          <div class="flex space-x-4 mb-5">
            <CustomInput name="firstName" placeholder="First name" v-model="formInput.firstName"/>
            <CustomInput name="lastName" placeholder="Last name" v-model="formInput.lastName"/>
          </div>
          <div class="block mb-5">
            <CustomInput name="email" placeholder="Email address" v-model="formInput.email" type="email"/>
          </div>
          <div class="block mb-5">
            <CustomInput name="password" placeholder="Password" v-model="formInput.password" type="password"/>
          </div>
          <button
              :disabled="!canSubmit ||isProcessing"
              class="primary-button flex items-center justify-center space-x-2"
              type="button"
              @click.prevent="submit"
          >
            <LoadingSpinnerIcon v-if="isProcessing" class="text-primary animate-spin"/>
            <span v-else> Create account</span>

          </button>
          <p class="font-medium text-center mx-auto">
            <span class="mr-2">Already have an account?</span>
            <NuxtLink class="text-indigo-600 hover:text-indigo-700" :to="AppRoutes.login">Login</NuxtLink>
          </p>
        </form>
      </div>
    </div>
  </section>
</template>
<script setup lang="ts">
import CustomInput from "~/components/forms/CustomInput.vue";
import {AppRoutes} from "~/core/routes";
import {useAuthStore} from "~/stores/auth";
import {storeToRefs} from "pinia";
import LoadingSpinnerIcon from "~/components/icons/LoadingSpinnerIcon.vue";
import {registerFormSchema} from "~/core/validations";

const formInput = ref({
  email: 'john@gmail.com',
  password: 'test',
  firstName: 'John',
  lastName: 'Doe'
})

const canSubmit = ref(false)

watch(formInput, async (oldVal, newVal) => {
  canSubmit.value = await registerFormSchema.isValid(formInput.value);

}, {deep: true},)

const authStore = useAuthStore()

const {isProcessing, errorMessage} = storeToRefs(authStore)

const {register} = authStore

const submit = async () => {
  await register(formInput.value)
}


</script>
