<template>

  <main>
    <BasicFormContent
      description="You have forgotten your password? No worries, we will help you reset it."
      show-close-button
      title="Welcome Back">

      <template #form>
        <form class="space-y-4">
          <div class="block mb-5">
            <CustomInput v-model="passwordForgetDataInput.email" autocomplete="username" name="email"
                         placeholder="Email address"
                         type="email" />
          </div>
          <button
            :disabled="isHandlingForgotPassword || !canSubmitForgetPasswordForm"
            class="primary-button flex items-center justify-center space-x-2"
            type="button"
            @click.prevent="submitPasswordForgetForm">
            <LoadingSpinnerIcon v-if="isHandlingForgotPassword" class="text-primary animate-spin" />
            <span v-else> Send password reset email</span>
          </button>

        </Form>
      </template>
    </BasicFormContent>
  </main>
</template>
<script lang="ts" setup>

  import CustomInput from '~/components/forms/CustomInput.vue';
  import LoadingSpinnerIcon from '~/components/icons/LoadingSpinnerIcon.vue';
  import BasicFormContent from '~/components/ui/BasicFormContent.vue';
  //@ts-ignore
  import type { Notification } from '#ui/types';
  import { usePasswordReset } from '~/composables/usePasswordReset';
  import type { AppAnalyticsProvider } from '~/services/analytics/app_analytics_provider';
  import { AnalyticsEvent } from '~/services/analytics/events';

  definePageMeta({
    middleware: ['logged-in'],
    title: 'Password reset',
  });

  onMounted(() => {
      (useNuxtApp().$analytics as AppAnalyticsProvider).capture(AnalyticsEvent.passwordForgetPageEntered);
    },
  );

  useSeoMeta({
    title: `FlutterGigs - Password reset`,
    ogTitle: 'FlutterGigs - Password reset',
    ogImage: 'https://fluttergigs.com/fluttergigs-og.png',
    ogSiteName: 'Flutter Gigs - The #1 Flutter job platform',
    description: 'You have forgotten your password? No worries, we will help you reset it.',
    ogDescription: 'You have forgotten your password? No worries, we will help you reset it',
    twitterCard: 'summary_large_image',
    twitterImage: 'https://fluttergigs.com/fluttergigs-og.png',
    twitterSite: '@fluttergigs',
    twitterTitle: `Flutter Gigs - The #1 Flutter job platform`,
    twitterDescription: 'Login and get access to thousands of opportunities',
  });

  const {
    passwordForgetDataInput,
    submitPasswordForgetForm,
    isHandlingForgotPassword,
    canSubmitForgetPasswordForm,
  } = usePasswordReset();
</script>
