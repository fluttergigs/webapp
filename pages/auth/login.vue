<template>

  <BasicFormContent
      description="Login and get access to thousands of opportunities"
      show-close-button
      title="Welcome Back">

    <template #form>
      <form class="space-y-4">
        <div class="block mb-5">
          <CustomInput v-model="formInput.email" name="email" placeholder="Email address" type="email"/>
        </div>
        <div class="block mb-5">
          <CustomInput v-model="formInput.password" inside-text="Forgot Password?" name="password" placeholder="Password"
                       type="password"/>
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
          <NuxtLink :to="AppRoutes.register" class="ml-2 text-indigo-600 hover:text-indigo-700">Create free account
          </NuxtLink>
        </p>
      </Form>
    </template>
  </BasicFormContent>
</template>
<script lang="ts" setup>
import CustomInput from "~/components/forms/CustomInput.vue";
import {AppRoutes} from "~/core/routes";
import LoadingSpinnerIcon from "~/components/icons/LoadingSpinnerIcon.vue";
import BasicFormContent from "~/components/ui/BasicFormContent.vue";
//@ts-ignore
import type {Notification} from "#ui/types";
import {useLogin} from "~/composables/useLogin";

useHead({title: "Flutter Gigs - Login"});

definePageMeta({
  middleware: ['logged-in'],
  title: 'Login',
})

useServerSeoMeta({
  title: `FlutterGigs - Login`,
  ogTitle: 'FlutterGigs - Login',
  ogImage: 'https://fluttergigs.com/fluttergigs-og.png',
  ogSiteName: "Flutter Gigs - The #1 Flutter job platform",
  description: 'Login and get access to thousands of opportunities',
  ogDescription: 'Login and get access to thousands of opportunities',
  twitterCard: 'summary_large_image',
  twitterImage: 'https://fluttergigs.com/fluttergigs-og.png',
  twitterSite: "@fluttergigs",
  twitterTitle: `Flutter Gigs - The #1 Flutter job platform`,
  twitterDescription: 'Login and get access to thousands of opportunities',
})

const {formInput, canSubmit, user, submit, onSuccessfulLogin} = useLogin()
</script>
