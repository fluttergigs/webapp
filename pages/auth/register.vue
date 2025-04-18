<template>
  <main>
    <BasicFormContent
      description="Create an account to get access thousands of Flutter job offers and Consultants"
      show-close-button
      title="Join for free">

      <template #form>
        <form class="flex flex-col space-y-4">
          <!--          <div class="flex space-x-4 mb-5 w-full">
                      <CustomInput v-model="formInput.firstName" class="w-1/2" name="firstName" placeholder="First name"/>
                      <CustomInput v-model="formInput.lastName" class="w-1/2" name="lastName" placeholder="Last name"/>
                    </div>-->
          <div class="block mb-5">
            <CustomInput v-model="formInput.email" autocomplete="username" name="email" placeholder="Email address"
                         type="email" />
          </div>
          <div class="block mb-5">
            <CustomInput v-model="formInput.password" autocomplete="new-password" name="password" placeholder="Password"
                         type="password" />
          </div>
          <button
            :disabled="!canSubmit || user.isLoading"
            class="primary-button flex items-center justify-center space-x-2"
            type="button"
            @click.prevent="submit(onSuccessfulRegistration)">
            <LoadingSpinnerIcon v-if="user.isLoading" class="text-primary animate-spin" />
            <span v-else> Create account</span>

          </button>
          <p class="font-medium text-center mx-auto">
            <span class="mr-2">Already have an account?</span>
            <NuxtLink :to="AppRoutes.login" class="text-indigo-600 hover:text-indigo-700">Login</NuxtLink>
          </p>
        </form>
      </template>
    </BasicFormContent>
  </main>
</template>
<script lang="ts" setup>
  import CustomInput from '~/components/forms/CustomInput.vue';
  import { AppRoutes } from '~/core/routes';
  import LoadingSpinnerIcon from '~/components/icons/LoadingSpinnerIcon.vue';
  import BasicFormContent from '~/components/ui/BasicFormContent.vue';
  //@ts-ignore
  import type { Notification } from '#ui/types';
  import { useRegister } from '~/composables/useRegister';


  useServerSeoMeta({
    title: `FlutterGigs - The #1 Flutter jobs platform in the world`,
    ogTitle: 'FlutterGigs - The #1 Flutter jobs platform in the world',
    ogUrl: 'https://fluttergigs.com',
    ogImage: 'https://fluttergigs.com/fluttergigs-og.png',
    description: 'Flutter Gigs is a platform to find Flutter framework related job opportunities and more',
    ogDescription: 'Flutter Gigs is a platform to find Flutter framework related job opportunities and more',
    ogSiteName: 'Flutter Gigs',
    twitterCard: 'summary_large_image',
    twitterSite: '@fluttergigs',
    twitterTitle: `Flutter Gigs - Find the best Flutter opportunities at top remote companies around the world`,
    twitterDescription: 'Flutter Gigs is a platform to find Flutter framework related job opportunities and more',
    twitterImage: 'https://fluttergigs.com/fluttergigs-og.png',
  });

  definePageMeta({
    middleware: ['logged-in'],
    title: 'Create your account',
  });

  const { formInput, canSubmit, user, submit, onSuccessfulRegistration } = useRegister();

</script>
