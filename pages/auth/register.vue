<template>
  <main>
    <BasicFormContent
      description="Create an account to get access thousands of Flutter job offers and Consultants"
      show-close-button
      title="Join for free"
    >
      <template #form>
        <form class="flex flex-col space-y-4">
          <!--          <div class="flex space-x-4 mb-5 w-full">
                      <CustomInput v-model="formInput.firstName" class="w-1/2" name="firstName" placeholder="First name"/>
                      <CustomInput v-model="formInput.lastName" class="w-1/2" name="lastName" placeholder="Last name"/>
                    </div>-->
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
              autocomplete="new-password"
              name="password"
              placeholder="Password"
              type="password"
            />
          </div>
          <UButton
            class="w-full"
            label="Create account"
            :disabled="!canSubmit || user.isLoading"
            :loading="user.isLoading"
            size="xl"
            @click.prevent="submit(onSuccessfulRegistration)"
          />

          <p class="font-medium text-center mx-auto">
            <span class="mr-2">Already have an account?</span>
            <NuxtLink :to="AppRoutes.login" class="text-indigo-600 hover:text-indigo-700"
              >Login
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
  import CustomInput from '~/components/forms/CustomInput.vue';
  import LoadingSpinnerIcon from '~/components/icons/LoadingSpinnerIcon.vue';
  import BasicFormContent from '~/components/ui/BasicFormContent.vue';
  import { useRegister } from '~/composables/useRegister';
  import { AppRoutes } from '~/core/routes';
  import { AppAnalyticsProvider } from '~/services/analytics/AppAnalyticsProvider';
  import { AnalyticsEvent } from '~/services/analytics/events';

  useServerSeoMeta({
    title: `FlutterGigs - The #1 Flutter jobs platform in the world`,
    ogTitle: 'FlutterGigs - The #1 Flutter jobs platform in the world',
    ogUrl: 'https://fluttergigs.com',
    ogImage: 'https://fluttergigs.com/fluttergigs-og.png',
    description:
      'Flutter Gigs is a platform to find Flutter framework related job opportunities and more',
    ogDescription:
      'Flutter Gigs is a platform to find Flutter framework related job opportunities and more',
    ogSiteName: 'Flutter Gigs',
    twitterCard: 'summary_large_image',
    twitterSite: '@fluttergigs',
    twitterTitle: `Flutter Gigs - Find the best Flutter opportunities at top remote companies around the world`,
    twitterDescription:
      'Flutter Gigs is a platform to find Flutter framework related job opportunities and more',
    twitterImage: 'https://fluttergigs.com/fluttergigs-og.png',
  });

  definePageMeta({
    middleware: ['logged-in'],
    title: 'Create your account',
  });

  onMounted(() => {
    (useNuxtApp().$analytics as AppAnalyticsProvider).capture(
      AnalyticsEvent.registrationPageEntered,
    );
  });

  const { formInput, canSubmit, user, submit, onSuccessfulRegistration } = useRegister();
</script>
