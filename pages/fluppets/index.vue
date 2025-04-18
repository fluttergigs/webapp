<script lang="ts" setup>
  import { AppStrings } from '~/core/strings';
  import type { BaseToast } from '~/core/ui/base_toast';
  import { AvailableFlags } from '~/services/feature-flag/availableFlags';

  definePageMeta({
    title: 'Flutter snippets',
    middleware: [
      function (to: any, from: any) {
        if (!useFeatureFlags().isEnabled(AvailableFlags.fluppets)) {
          const { $toast } = useNuxtApp();

          if ($toast) {
            ($toast as BaseToast<Notification>)?.info(AppStrings.featureAvailableSoon);
          }
          return navigateTo(AppRoutes.welcome);
        }
      },
    ],
  });
</script>

<template></template>

<style scoped></style>
