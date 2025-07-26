<script lang="ts" setup>
  //@ts-ignore
  import type { Notification } from '#ui/types';
  import { AppStrings } from '~/core/strings';
  import type { BaseToast } from '~/core/ui/base_toast';
  import { AvailableFlags } from '~/services/feature-flag/availableFlags';

  definePageMeta({
    title: 'Flutter Consultants',
    middleware: [
      function (from: any, to: any) {
        if (!useFeatureFlags().isEnabled(AvailableFlags.hireConsultants)) {
          const { $toast } = useNuxtApp();
          if ($toast) {
            ($toast as BaseToast<Notification, number>).info(AppStrings.featureAvailableSoon);
          }
          return navigateTo(AppRoutes.welcome);
        }
      },
    ],
  });
</script>

<template>
  <main></main>
</template>

<style scoped></style>
