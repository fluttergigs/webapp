<template>
  <section class="pt-32 pb-36 bg-white overflow-hidden">
    <div class="container px-4 mx-auto">
      <div class="flex flex-wrap -m-8">
        <div class="w-full md:w-1/2 p-8">
          <div class="flex flex-col justify-between h-full">
            <div class="mb-8">
              <h2 class="mb-6 text-14xl text-indigo-600 font-bold tracking-px-2n leading-none">
                {{ props.error.statusCode }}
              </h2>
              <h3 class="mb-4 text-3xl font-bold font-heading leading-snug">Something is wrong!</h3>
              <p class="text-lg text-gray-600 font-medium leading-normal md:max-w-md">
                {{ errorMessage }}
              </p>
            </div>
            <div
              class="cursor-pointer inline-flex space-x-2 items-center text-center font-semibold text-indigo-600"
              @click="handleError"
            >
              <ArrowLeftIcon class="text-indigo-700 w-4" />
              <span>Go Back to Homepage</span>
            </div>
          </div>
        </div>
        <div class="w-full md:w-1/2 p-4 self-end">
          <img
            alt="Error image"
            class="mx-auto transform hover:-translate-x-4 transition ease-in-out duration-500"
            src="@/assets/images/error.png"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
  //@ts-ignore
  //@ts-ignore
  import type { NuxtError } from '#app';
  import { ArrowLeftIcon } from '@heroicons/vue/24/solid';
  import { logDev } from '~/core/helpers/log';
  import { AppRoutes } from '~/core/routes';
  import { AppStrings } from '~/core/strings';
  import type { AppAnalyticsProvider } from '~/services/analytics/AppAnalyticsProvider';
  import { AnalyticsEvent } from '~/services/analytics/events';

  useHead({ title: 'FlutterGigs - Error ' });

  //@ts-ignore
  const props = defineProps({
    error: Object as () => NuxtError,
  });

  onMounted(() => {
    logDev('ERROR MESSAGE', props.error?.message);
    logDev('ERROR STACK', props.error?.stack);
    logDev('ERROR STATUS CODE', props.error?.statusCode);

    if (import.meta.env.MODE !== 'development') {
      (useNuxtApp().$analytics as AppAnalyticsProvider).capture(AnalyticsEvent.error, props.error);
    }
  });

  const handleError = () => clearError({ redirect: AppRoutes.welcome });
  const errorMessage = computed(() =>
    true
      ? props.error?.statusCode === 404
        ? AppStrings.notFoundMessage
        : AppStrings.errorMessage
      : props.error?.message,
  );
</script>
