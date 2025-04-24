<template>
  <main>
    <BasicFormContent
      description="Login and get access to thousands of opportunities"
      show-close-button
      title="Welcome Back"
    >
      <template #form>
        <form class="space-y-4">
          <div class="block mb-5">
            <CustomInput
              v-model="formInput.email"
              autocomplete="username"
              name="email"
              placeholder="Email address"
              type="email"
            />
          </div>
          <div class="block mb-5">
            <CustomInput
              v-model="formInput.password"
              :type="passwordFieldType"
              autocomplete="current-password"
              inside-text="Forgot Password?"
              name="password"
              placeholder="Password"
            >
              <template #insideText>
                <div class="absolute right-4 bottom-4 transform" @click="togglePasswordVisibility">
                  <EyeSlashIcon v-if="isPasswordVisible" class="w-4" />
                  <EyeIcon v-else class="w-4" />
                </div>
              </template>
            </CustomInput>
          </div>
          <UButton
            class="w-full"
            label="Sign In"
            :loading="user.isLoading"
            :disabled="!canSubmit || user.isLoading"
            size="xl"
            @click.prevent="() => submit(onSuccessfulLogin)"
          />
          <p class="font-medium">
            <span>Don’t have an account?</span>
            <NuxtLink :to="AppRoutes.register" class="ml-2 text-indigo-600 hover:text-indigo-700"
              >Create free account
            </NuxtLink>
          </p>
          <p class="font-medium">
            <span>Forgot your password?</span>
            <NuxtLink :to="AppRoutes.forgotPassword" class="ml-2 text-red-600 hover:text-red-700"
              >Reset it
            </NuxtLink>
          </p>
        </form>
      </template>
    </BasicFormContent>
  </main>
</template>
<script lang="ts" setup>
  //@ts-ignore
  import type { Notification } from '#ui/types';
  import { EyeIcon, EyeSlashIcon } from '@heroicons/vue/16/solid';
  import CustomInput from '~/components/forms/CustomInput.vue';
  import LoadingSpinnerIcon from '~/components/icons/LoadingSpinnerIcon.vue';
  import BasicFormContent from '~/components/ui/BasicFormContent.vue';
  import { useFields } from '~/composables/useFields';
  import { useLogin } from '~/composables/useLogin';
  import { AppRoutes } from '~/core/routes';
  import { AppAnalyticsProvider } from '~/services/analytics/AppAnalyticsProvider';
  import { AnalyticsEvent } from '~/services/analytics/events';

  definePageMeta({
    middleware: ['logged-in'],
    title: 'Login',
  });

  useSeoMeta({
    title: `FlutterGigs - The #1 Flutter jobs platform in the world`,
    ogTitle: 'FlutterGigs - The #1 Flutter jobs platform in the world',
    ogImage: 'https://fluttergigs.com/fluttergigs-og.png',
    ogSiteName: 'Flutter Gigs - The #1 Flutter job platform',
    description: 'Login and get access to thousands of opportunities',
    ogDescription: 'Login and get access to thousands of opportunities',
    twitterCard: 'summary_large_image',
    twitterImage: 'https://fluttergigs.com/fluttergigs-og.png',
    twitterSite: '@fluttergigs',
    twitterTitle: `Flutter Gigs - The #1 Flutter job platform`,
    twitterDescription: 'Login and get access to thousands of opportunities',
  });

  onMounted(() => {
    (useNuxtApp().$analytics as AppAnalyticsProvider).capture(AnalyticsEvent.loginPageEntered);
  });

  const { formInput, canSubmit, user, submit, onSuccessfulLogin } = useLogin();
  const { isPasswordVisible, togglePasswordVisibility, passwordFieldType } = useFields();
</script>
