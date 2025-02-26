<template>

  <main>
    <BasicFormContent
        description="Reset your password"
        show-close-button
        title="Welcome Back">

      <template #form>
        <form class="space-y-4">
          <div class="block mb-5">
            <CustomInput v-model="resetPasswordDataInput.password" :type="passwordFieldType"
                         autocomplete="new-password"
                         name="password"
                         placeholder="Your new Password">
              <template #insideText>
                <div class="absolute right-4 bottom-4 transform" @click="togglePasswordVisibility">
                  <EyeSlashIcon v-if="isPasswordVisible" class="w-4"/>
                  <EyeIcon v-else class="w-4"/>
                </div>
              </template>
            </CustomInput>
          </div>

          <div class="block mb-5">
            <CustomInput v-model="resetPasswordDataInput.passwordConfirmation" :type="passwordFieldType"
                         autocomplete="new-password"
                         name="confirmPassword"
                         placeholder="Confirm your Password"/>
          </div>
          <button
              :disabled="!canSubmitResetPasswordForm || isHandlingPasswordReset"
              class="primary-button flex items-center justify-center space-x-2"
              type="button"
              @click.prevent="()=> submitPasswordResetForm(() => navigateTo(AppRoutes.login))">
            <LoadingSpinnerIcon v-if="isHandlingPasswordReset" class="text-primary animate-spin"/>
            <span v-else> Reset my password</span>

          </button>
        </Form>
      </template>
    </BasicFormContent>
  </main>
</template>
<script lang="ts" setup>

import {EyeIcon, EyeSlashIcon} from "@heroicons/vue/16/solid";
import CustomInput from "~/components/forms/CustomInput.vue";
import {AppRoutes} from "~/core/routes";
import LoadingSpinnerIcon from "~/components/icons/LoadingSpinnerIcon.vue";
import BasicFormContent from "~/components/ui/BasicFormContent.vue";
//@ts-ignore
import type {Notification} from "#ui/types";
import {useFields} from "~/composables/useFields";
import type {AppAnalyticsProvider} from "~/services/analytics/app_analytics_provider";
import {AnalyticsEvent} from "~/services/analytics/events";

definePageMeta({
  middleware: ['logged-in', (to: any, from: any) => {

    if (!useRoute().query.code) {
      return navigateTo(AppRoutes.login)
    }

  }],

  title: 'Password reset',
})

onMounted(() => {
      (useNuxtApp().$analytics as AppAnalyticsProvider).capture(AnalyticsEvent.passwordForgetPageEntered);

      resetPasswordDataInput.value.code = useRoute().query.code as string
    }
)

useSeoMeta({
  title: `FlutterGigs - Reset your password`,
  ogTitle: 'FlutterGigs - Reset your password',
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

const {
  canSubmitResetPasswordForm,
  isHandlingPasswordReset,
  submitPasswordResetForm,
  resetPasswordDataInput
} = usePasswordReset()
const {isPasswordVisible, togglePasswordVisibility, passwordFieldType} = useFields()
</script>
