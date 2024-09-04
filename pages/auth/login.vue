<template>

  <BasicFormContent
      show-close-button
      title="Welcome Back"
      description="Login and get access to thousands of opportunities">

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
            @click.prevent="()=> submit(onSuccessfulLogin)">
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
import {AppRoutes} from "~/core/routes";
import LoadingSpinnerIcon from "~/components/icons/LoadingSpinnerIcon.vue";
import {Form} from 'vee-validate'
import BasicFormContent from "~/components/ui/BasicFormContent.vue";
//@ts-ignore
import type {Notification} from "#ui/types";
import {useLogin} from "~/composables/useLogin";

useHead({title: "Flutter Gigs - Login"});

definePageMeta({
  middleware: ['logged-in'],
  layout: 'auth-layout'
})

const {formInput, canSubmit, user, submit, onSuccessfulLogin} = useLogin()
</script>
